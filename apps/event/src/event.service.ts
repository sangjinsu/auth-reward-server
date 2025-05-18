import {Injectable} from '@nestjs/common';
import {CreateEventDto} from "./dto/event/create-event.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {EventSetting, EventSettingDocument} from "./schemas/event-setting.schema";
import {FindEventQueryDto} from "./dto/event/find-event.query.dto";
import {UpdateEventDto} from "./dto/event/update-event.dto";


@Injectable()
export class EventService {

    constructor(
        @InjectModel(EventSetting.name) private eventModel: Model<EventSettingDocument>,

    ) {
    }

    async createEvent(dto: CreateEventDto) {

        const created = await this.eventModel.create({
            ...dto,
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
            createdBy: new Types.ObjectId(dto.userId),
        });

        return {
            message: '이벤트가 성공적으로 등록되었습니다.',
            eventId: created._id,
        };
    }

    async findAll(query: FindEventQueryDto) {
        const filter: any = {};

        if (query.type) filter.type = parseInt(query.type, 10);
        if (query.status) filter.status = query.status;
        if (query.startDate || query.endDate) {
            filter.startDate = {};
            if (query.startDate) filter.startDate.$gte = new Date(query.startDate);
            if (query.endDate) filter.startDate.$lte = new Date(query.endDate);
        }

        const events = await this.eventModel.find(filter).sort({startDate: -1});
        return events;
    }

    async findById(id: string) {
        const event = await this.eventModel.findById(id);
        if (!event) {
            throw new Error('이벤트를 찾을 수 없습니다.');
        }
        return event;
    }


    async updateEvent(id: string, dto: UpdateEventDto) {
        const updated = await this.eventModel.findByIdAndUpdate(
            id,
            {
                ...(dto.title && { title: dto.title }),
                ...(dto.condition && { condition: dto.condition }),
                ...(dto.startDate && { startDate: new Date(dto.startDate) }),
                ...(dto.endDate && { endDate: new Date(dto.endDate) }),
                ...(dto.status && { status: dto.status }),
            },
            { new: true },
        );

        if (!updated) {
            throw new Error('이벤트를 찾을 수 없습니다.');
        }

        return {
            message: '이벤트가 성공적으로 수정되었습니다.',
            updated,
        };
    }

    async deleteEvent(id: string) {
        const deleted = await this.eventModel.findByIdAndDelete(id);

        if (!deleted) {
            throw new Error('삭제할 이벤트를 찾을 수 없습니다.');
        }

        return {
            message: '이벤트가 성공적으로 삭제되었습니다.',
            eventId: deleted._id,
        };
    }

}
