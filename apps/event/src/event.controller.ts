import {Controller, NotFoundException} from '@nestjs/common';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {CreateEventDto} from "./dto/event/create-event.dto";
import {EventService} from "./event.service";
import {FindEventQueryDto} from "./dto/event/find-event.query.dto";
import {UpdateEventDto} from "./dto/event/update-event.dto";
import {CreateRewardTypeDto} from "./dto/reward/create-reward-type.dto";
import {RewardTypeService} from "./reward-type.service";
import {UpdateRewardTypeDto} from "./dto/reward/update-reward-type.dto";
import {InjectModel} from "@nestjs/mongoose";
import {RewardType, RewardTypeDocument} from "./schemas/reward-type.schema";
import {EventSetting, EventSettingDocument} from "./schemas/event-setting.schema";
import {Model} from "mongoose";

@Controller()
export class EventController {
    constructor(
        private readonly eventService: EventService,
        private readonly  rewardTypeService: RewardTypeService,

        @InjectModel(EventSetting.name) private eventModel: Model<EventSettingDocument>,
        @InjectModel(RewardType.name) private rewardTypeModel: Model<RewardTypeDocument>,
    ) {
        this.eventService = new EventService(this.eventModel);
        this.rewardTypeService = new RewardTypeService(this.rewardTypeModel);
    }

    @MessagePattern('event_ping')
    ping() {
        return {valid: true};
    }

    @MessagePattern('event_create')
    async create(@Payload() dto: CreateEventDto) {
        try {
            return this.eventService.createEvent(dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 이벤트입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('event_find_all')
    async findAll(@Payload() query: FindEventQueryDto) {
        try {
            return this.eventService.findAll(query);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 이벤트입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('event_find_by_id')
    async findById(@Payload() id: string) {
        try {
            return this.eventService.findById(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 이벤트입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('event_update_by_id')
    async updateById(@Payload() data: { id: string; dto: UpdateEventDto }) {
        try {
            return this.eventService.updateEvent(data.id, data.dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 이벤트입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('event_delete_by_id')
    async deleteById(@Payload() id: string) {
        try {
            return this.eventService.deleteEvent(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 이벤트입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_create')
    async createRewardType(@Payload() dto: CreateRewardTypeDto) {
        try {
            return this.rewardTypeService.create(dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 RewardType입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_find_all')
    async findAllRewardType() {
        try {
            return this.rewardTypeService.findAll();
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 RewardType입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_find_by_id')
    async findRewardTypeById(@Payload() rewardType: string) {
        try {
            return this.rewardTypeService.findByRewardType(rewardType);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 RewardType입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_update_by_id')
    async updateRewardTypeById(@Payload() payload: { id: string; dto: UpdateRewardTypeDto }) {
        try {
            return this.rewardTypeService.updateById(payload.id, payload.dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 RewardType입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_delete_by_id')
    async deleteRewardTypeById(@Payload() id: string) {
       try {
           return this.rewardTypeService.deleteById(id);
       } catch (error) {
              if (error instanceof NotFoundException) {
                return { error: '존재하지 않는 RewardType입니다.' };
              }
              throw error;
       }
    }

}
