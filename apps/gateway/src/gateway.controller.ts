import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Gateway Ping') // Swagger 문서의 그룹 이름
@Controller()
export class GatewayController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
        @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy
    ) {}

    @Get('/auth/ping')
    @ApiOperation({ summary: 'Auth 서비스 연결 확인' })
    @ApiResponse({ status: 200, description: 'Auth 마이크로서비스에서 pong 응답' })
    async pingAuth() {
        const res = this.authClient.send('auth_validate', {});
        return await lastValueFrom(res);
    }

    @Get('/event/ping')
    @ApiOperation({ summary: 'Event 서비스 연결 확인' })
    @ApiResponse({ status: 200, description: 'Event 마이크로서비스에서 pong 응답' })
    async pingEvent() {
        const res = this.eventClient.send('event_validate', {});
        return await lastValueFrom(res);
    }
}
