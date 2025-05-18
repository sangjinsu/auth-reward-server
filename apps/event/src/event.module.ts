import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGO_EVENT_URI'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [EventController],
    providers: [EventService],
})
export class EventModule {
}
