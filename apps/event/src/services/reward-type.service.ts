import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {RewardType, RewardTypeDocument} from "../schemas/reward-type.schema";
import {Model} from "mongoose";
import {CreateRewardTypeDto} from "../dto/reward/create-reward-type.dto";
import {UpdateRewardTypeDto} from "../dto/reward/update-reward-type.dto";

@Injectable()
export class RewardTypeService {
    constructor(
        @InjectModel(RewardType.name) private rewardTypeModel: Model<RewardTypeDocument>,
    ) {}

    async create(dto: CreateRewardTypeDto) {
        const exist = await this.rewardTypeModel.findOne({ type: dto.type });
        if (exist) {
            throw new ConflictException('이미 존재하는 타입입니다.');
        }

        const created = await this.rewardTypeModel.create(dto);
        return {
            message: 'RewardType이 생성되었습니다.',
            id: created._id,
        };
    }

    async findAll() {
        return this.rewardTypeModel.find().sort({ type: 1 }).lean();
    }

    async findByRewardType(type: string) {
        const rewardType = await this.rewardTypeModel.findOne(
            { type: type}
        )
        if (!rewardType) {
            throw new NotFoundException('RewardType을 찾을 수 없습니다.');
        }
        return rewardType;
    }

    async updateById(type: string, dto: UpdateRewardTypeDto) {
        const updated = await this.rewardTypeModel.findOneAndUpdate(
            { type: type },
            dto,
            { new: true }
        );

        if (!updated) {
            throw new NotFoundException('RewardType을 찾을 수 없습니다.');
        }

        return {
            message: 'RewardType이 성공적으로 수정되었습니다.',
            updated,
        };
    }

    async deleteById(rewardType: string) {
        const deleted = await this.rewardTypeModel.findOneAndDelete(
            { type: rewardType }
        )

        if (!deleted) {
            throw new NotFoundException('RewardType을 찾을 수 없습니다.');
        }

        return {
            message: 'RewardType이 성공적으로 삭제되었습니다.',
            id: deleted.type,
        };
    }


}