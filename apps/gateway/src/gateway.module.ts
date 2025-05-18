import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {GatewayController} from "./gateway.controller";

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
    controllers: [GatewayController],
})

export class GatewayModule {
}
