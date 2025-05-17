import {Controller, Get} from '@nestjs/common';
import {MessagePattern} from "@nestjs/microservices";

@Controller()
export class EventController {
    constructor() {
    }

    @MessagePattern('event_validate')
    handleValidate() {
        return {valid: true};
    }
}
