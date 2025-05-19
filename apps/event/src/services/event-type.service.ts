import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {RewardType, RewardTypeDocument} from "../schemas/reward-type.schema";
import {Model} from "mongoose";
import {CreateRewardTypeDto} from "../dto/reward/create-reward-type.dto";
import {UpdateRewardTypeDto} from "../dto/reward/update-reward-type.dto";
import {EventType, EventTypeDocument} from "../schemas/event-type.schema";
import {CreateEventTypeDto} from "../dto/event/create-event-type.dto";
import {UpdateEventTypeDto} from "../dto/event/update-event-type.dto";

@Injectable()
export class EventTypeService {
    constructor(
        @InjectModel(EventType.name) private model: Model<EventTypeDocument>,
    ) {}

    async create(dto: CreateEventTypeDto) {
        const exists = await this.model.findOne({ type: dto.type });
        if (exists) throw new ConflictException('이미 존재하는 타입입니다.');
        const created = await this.model.create(dto);
        return { message: 'EventType이 생성되었습니다.', id: created._id };
    }

    async findAll() {
        return this.model.find().sort({ type: 1 }).lean();
    }

    async findById(id: string) {
        const result = await this.model.findById(id).lean();
        if (!result) throw new NotFoundException('EventType을 찾을 수 없습니다.');
        return result;
    }

    async updateById(id: string, dto: UpdateEventTypeDto) {
        const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
        if (!updated) throw new NotFoundException('EventType을 찾을 수 없습니다.');
        return { message: 'EventType이 수정되었습니다.', updated };
    }

    async deleteById(id: string) {
        const deleted = await this.model.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException('EventType을 찾을 수 없습니다.');
        return { message: 'EventType이 삭제되었습니다.', id: deleted._id };
    }
}