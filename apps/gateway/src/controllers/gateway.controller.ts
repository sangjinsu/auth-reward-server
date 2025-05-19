import {Controller, Get, Inject} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {lastValueFrom} from 'rxjs';
import {ApiTags, ApiOperation} from '@nestjs/swagger';

@ApiTags('Ping')
@Controller()
export class GatewayController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
        @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
    ) {
    }

    @Get('/auth/ping')
    @ApiOperation({summary: 'Auth 서비스 연결 확인'})
    async pingAuth() {
        const res = this.authClient.send('auth_ping', {});
        return await lastValueFrom(res);
    }


    @Get('/event/ping')
    @ApiOperation({summary: 'Event 서비스 연결 확인'})
    async pingEvent() {
        const res = this.eventClient.send('event_ping', {});
        return await lastValueFrom(res);
    }
}
