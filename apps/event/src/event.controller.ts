import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {CreateEventDto} from "./dto/create-event.dto";
import {EventService} from "./event.service";
import {FindEventQueryDto} from "./dto/find-event.query.dto";
import {UpdateEventDto} from "./dto/update-event.dto";

@Controller()
export class EventController {
    constructor(
        private readonly eventService: EventService,
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


}
