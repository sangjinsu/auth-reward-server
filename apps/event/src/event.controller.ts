import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {CreateEventDto} from "./dto/event/create-event.dto";
import {EventService} from "./event.service";
import {FindEventQueryDto} from "./dto/event/find-event.query.dto";
import {UpdateEventDto} from "./dto/event/update-event.dto";
import {RewardService} from "./reward.service";
import {CreateRewardTypeDto} from "./dto/reward/create-reward-type.dto";
import {RewardTypeService} from "./reward-type.service";
import {UpdateRewardTypeDto} from "./dto/reward/update-reward-type.dto";

@Controller()
export class EventController {
    constructor(
        private readonly eventService: EventService,
        private readonly rewardService: RewardService,
        private readonly  rewardTypeService: RewardTypeService,
    ) {
    }

    @MessagePattern('event_ping')
    ping() {
        return {valid: true};
    }

    @MessagePattern('event_create')
    async create(@Payload() dto: CreateEventDto) {
        return this.eventService.createEvent(dto);
    }

    @MessagePattern('event_find_all')
    async findAll(@Payload() query: FindEventQueryDto) {
        return this.eventService.findAll(query);
    }

    @MessagePattern('event_find_by_id')
    async findById(@Payload() id: string) {
        return this.eventService.findById(id);
    }

    @MessagePattern('event_update_by_id')
    async updateById(@Payload() data: { id: string; dto: UpdateEventDto }) {
        return this.eventService.updateEvent(data.id, data.dto);
    }

    @MessagePattern('event_delete_by_id')
    async deleteById(@Payload() id: string) {
        return this.eventService.deleteEvent(id);
    }

    @MessagePattern('reward_type_create')
    async createRewardType(@Payload() dto: CreateRewardTypeDto) {
        return this.rewardTypeService.create(dto);
    }

    @MessagePattern('reward_type_find_all')
    async findAllRewardType() {
        return this.rewardTypeService.findAll();
    }

    @MessagePattern('reward_type_find_by_id')
    async findRewardTypeById(@Payload() id: string) {
        return this.rewardTypeService.findById(id);
    }

    @MessagePattern('reward_type_update_by_id')
    async updateRewardTypeById(@Payload() payload: { id: string; dto: UpdateRewardTypeDto }) {
        return this.rewardTypeService.updateById(payload.id, payload.dto);
    }

    @MessagePattern('reward_type_delete_by_id')
    async deleteRewardTypeById(@Payload() id: string) {
        return this.rewardTypeService.deleteById(id);
    }

}
