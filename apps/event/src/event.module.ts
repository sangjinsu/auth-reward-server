import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {EventService} from "./event.service";
import {EventSetting, EventSettingSchema} from "./schemas/event-setting.schema";

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
        MongooseModule.forFeature([{name: EventSetting.name, schema: EventSettingSchema}]),
    ],
    controllers: [EventController],
    providers: [EventService],
})
export class EventModule {
}
