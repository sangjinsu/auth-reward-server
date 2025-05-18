import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {EventService} from "./event.service";
import {EventSetting, EventSettingSchema} from "./schemas/event-setting.schema";
import { RewardService } from './reward.service';
import {RewardType, RewardTypeSchema} from "./schemas/reward-type.schema";
import {Reward, RewardSchema} from "./schemas/reward.schema";
import {RewardRequest, RewardRequestSchema} from "./schemas/reward-request.schema";
import {RewardTypeService} from "./reward-type.service";

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
        MongooseModule.forFeature([
            {name: EventSetting.name, schema: EventSettingSchema},
            {name: RewardType.name, schema: RewardTypeSchema},
            {name: Reward.name, schema: RewardSchema},
            {name: RewardRequest.name, schema: RewardRequestSchema}
        ]),
    ],
    controllers: [EventController],
    providers: [EventService, RewardService, RewardTypeService],
})
export class EventModule {
}
