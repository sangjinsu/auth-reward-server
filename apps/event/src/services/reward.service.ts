import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateRewardDto} from "../dto/reward/create-reward.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Reward, RewardDocument} from "../schemas/reward.schema";
import {Model} from "mongoose";
import {EventSetting, EventSettingDocument} from "../schemas/event-setting.schema";
import {RewardType, RewardTypeDocument} from "../schemas/reward-type.schema";
import {UpdateRewardDto} from "../dto/reward/update-reward.dto";
import {EventTypeDocument} from "../schemas/event-type.schema";
import {RewardRequest, RewardRequestDocument} from "../schemas/reward-request.schema";
import {RewardConditionEvaluator} from "../evaluator/reward-condition-evaluator";
import {EventTypeEnum} from "../enums/event-type.enum";

@Injectable()
export class RewardService {

    constructor(
        @InjectModel(Reward.name)
        private readonly rewardModel: Model<RewardDocument>,
        @InjectModel(EventSetting.name)
        private readonly eventModel: Model<EventSettingDocument>,
        @InjectModel(RewardType.name)
        private readonly rewardTypeModel: Model<RewardTypeDocument>,
        @InjectModel(EventSetting.name)
        private readonly eventTypeModel: Model<EventTypeDocument>,
        @InjectModel(RewardRequest.name)
        private readonly rewardRequestModel: Model<RewardRequestDocument>,
        private conditionEvaluator: RewardConditionEvaluator
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

    async requestReward(eventId: string, userId: string) {

        let request = await this.rewardRequestModel.create({
            userId,
            eventId,
            status: 'PENDING',
            requestedAt: new Date(),
        });


        const event = await this.eventModel.findById(eventId);
        if (!event) {
            await this.rewardRequestModel.findOneAndUpdate(
                {userId, eventId}, {
                    status: 'FAILED',
                    evaluatedAt: new Date(),
                    failureReason: '이벤트가 존재하지 않습니다.',
                }
            )
            throw new NotFoundException('이벤트가 존재하지 않습니다.');
        }

        const eventType = await this.eventTypeModel.findOne({
            eventType: event.eventType
        })
        if (!eventType) {
            await this.rewardRequestModel.findOneAndUpdate(
                {userId, eventId}, {
                    status: 'FAILED',
                    evaluatedAt: new Date(),
                    failureReason: '이벤트 타입을 찾을 수 없습니다.',
                }
            )
            throw new NotFoundException('이벤트 타입을 찾을 수 없습니다.');
        }

        const hasRequested = await this.rewardRequestModel.findOne({userId, eventId});
        if (hasRequested) {

            // 🚨 이미 요청한 경우
            await this.rewardRequestModel.findOneAndUpdate(
                {userId, eventId}, {
                    status: 'FAILED',
                    evaluatedAt: new Date(),
                    failureReason: '이미 해당 이벤트의 보상을 요청하였습니다.',
                }
            )

            throw new ConflictException('이미 해당 이벤트의 보상을 요청하였습니다.');
        }

        const now = new Date();
        if (now <= event.startDate || now > event.endDate) {
            await this.rewardRequestModel.create({
                userId,
                eventId,
                status: 'FAILED',
                requestedAt: new Date(),
                evaluatedAt: new Date(),
                failureReason: '이벤트 기간이 아닙니다.',
            });

            throw new BadRequestException('이벤트 기간이 아닙니다.');
        }

        // 🎯 조건 검증 (전략에 따라)
        const passed = await this.conditionEvaluator.evaluate(
            eventType.type as EventTypeEnum,
            userId,
            {
                ...event.condition.params,
                startDate: event.startDate,
                endDate: event.endDate,
            },
        );

        if (!passed) {
            await this.rewardRequestModel.findOneAndUpdate(
                {userId, eventId},
                {
                    status: 'FAILED',
                    evaluatedAt: new Date(),
                    failureReason: '보상 조건을 충족하지 않았습니다.',
                }
            )
            throw new BadRequestException('보상 조건을 충족하지 않았습니다.');
        }

        // 🎁 보상 조회
        const rewards = await this.rewardModel.find({eventId});
        if (!rewards.length) {
            // 🚨 보상이 없을 경우
            await this.rewardRequestModel.findOneAndUpdate(
                {userId, eventId},
                {
                    status: 'FAILED',
                    evaluatedAt: new Date(),
                    failureReason: '보상 내역이 없습니다'
                }
            )

            throw new NotFoundException('해당 이벤트에 연결된 보상이 없습니다.');
        }

        // 🧾 보상 요청 저장
        await this.rewardRequestModel.findOneAndUpdate(
            {userId, eventId},
            {
                status: 'SUCCESS',
                evaluatedAt: new Date(),
                rewardIds: rewards.map((reward) => reward._id),
            }
        )


        return {
            message: '보상이 성공적으로 지급되었습니다.',
            requestId: request._id,
            rewards,
        };
    }

    async findMyRewardRequests(userId: string) {
        return this.rewardRequestModel
            .find({ userId })
            .sort({ requestedAt: -1 })
            .lean();
    }

    async findAllRewardRequests(filters: {
        userId?: string;
        eventId?: string;
        status?: string;
    }) {
        const query: any = {};
        if (filters.userId) query.userId = filters.userId;
        if (filters.eventId) query.eventId = filters.eventId;
        if (filters.status) query.status = filters.status;

        return this.rewardRequestModel
            .find(query)
            .sort({ requestedAt: -1 })
            .lean();
    }

}
