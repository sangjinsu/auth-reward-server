import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {GatewayController} from "./controllers/gateway.controller";
import {AuthController} from "./controllers/auth.controller";
import {EventController} from "./controllers/event.controller";
import { RewardTypeController } from './controllers/reward-type.controller';
import {RewardController} from "./controllers/reward.controller";
import {EventTypeController} from "./controllers/event-type.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE',
                imports: [ConfigModule],
                useFactory: (config: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: config.get('AUTH_SERVICE_HOST', 'localhost'),
                        port: config.get('AUTH_SERVICE_PORT') || 3001,
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'EVENT_SERVICE',
                imports: [ConfigModule],
                useFactory: (config: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: config.get('EVENT_SERVICE_HOST', 'localhost'),
                        port: config.get('EVENT_SERVICE_PORT') || 3002,
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [
        GatewayController,
        AuthController,
        EventTypeController,
        EventController,
        RewardTypeController,
        RewardController,
    ],
})

export class GatewayModule {
}
