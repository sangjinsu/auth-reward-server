import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateRewardDto} from "../dto/reward/create-reward.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Reward, RewardDocument} from "../schemas/reward.schema";
import {Model} from "mongoose";
import {EventSetting, EventSettingDocument} from "../schemas/event-setting.schema";
import {RewardType, RewardTypeDocument} from "../schemas/reward-type.schema";
import {UpdateRewardDto} from "../dto/reward/update-reward.dto";

@Injectable()
export class RewardService {

    constructor(
        @InjectModel(Reward.name)
        private readonly rewardModel: Model<RewardDocument>,
        @InjectModel(EventSetting.name)
        private readonly eventModel: Model<EventSettingDocument>,
        @InjectModel(RewardType.name)
        private readonly rewardTypeModel: Model<RewardTypeDocument>,
    ) {
    }

    async createReward(eventId: string, dto: CreateRewardDto) {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new NotFoundException('해당 이벤트가 존재하지 않습니다.');
        }

        const rewardType = await this.rewardTypeModel.findOne({type: dto.rewardType});
        if (!rewardType) {
            throw new NotFoundException('해당 보상 타입이 존재하지 않습니다.');
        }

        const reward = await this.rewardModel.create({
            eventId,
            rewardType: dto.rewardType,
            quantity: dto.quantity,
        });

        return {
            message: '보상이 등록되었습니다.',
            rewardId: reward._id,
            rewardType: reward.rewardType,
            quantity: reward.quantity
        };
    }

    async findByEvent(eventId: string) {
        return this.rewardModel.find({eventId});
    }

    async findById(id: string) {
        const reward = await this.rewardModel.findById(id);
        if (!reward) throw new NotFoundException('보상을 찾을 수 없습니다.');
        return reward;
    }

    async findAll() {
        return this.rewardModel.find();
    }


    async updateById(id: string, dto: UpdateRewardDto) {
        const updated = await this.rewardModel.findByIdAndUpdate(id, dto, {new: true});
        if (!updated) throw new NotFoundException('보상을 찾을 수 없습니다.');
        return {message: '보상이 수정되었습니다.', updated};
    }

    async deleteById(id: string) {
        const deleted = await this.rewardModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException('보상을 찾을 수 없습니다.');

        return {message: '보상이 삭제되었습니다.', id: deleted._id};
    }
}
