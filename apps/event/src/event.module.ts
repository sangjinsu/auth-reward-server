import * as dotenv from 'dotenv';

dotenv.config()
import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {EventService} from "./services/event.service";
import {EventSetting, EventSettingSchema} from "./schemas/event-setting.schema";
import {RewardService} from './services/reward.service';
import {RewardType, RewardTypeSchema} from "./schemas/reward-type.schema";
import {Reward, RewardSchema} from "./schemas/reward.schema";
import {RewardRequest, RewardRequestSchema} from "./schemas/reward-request.schema";
import {RewardTypeService} from "./services/reward-type.service";
import {EventType, EventTypeSchema} from "./schemas/event-type.schema";
import {AttendanceStrategy} from "./strategy/attendance.strategy";
import {NRUStrategy} from "./strategy/nru.strategy";
import {CBUStrategy} from "./strategy/cbu.strategy";
import {RewardConditionEvaluator} from "./evaluator/reward-condition-evaluator";
import {User, UserSchema} from "./schemas/user.schema";
import {Attendance, AttendanceSchema} from "./schemas/attendance.schema";
import {UserService} from "./services/user.service";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGO_EVENT_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            {name: EventType.name, schema: EventTypeSchema},
            {name: EventSetting.name, schema: EventSettingSchema},
            {name: RewardType.name, schema: RewardTypeSchema},
            {name: Reward.name, schema: RewardSchema},
            {name: RewardRequest.name, schema: RewardRequestSchema},

            {name: User.name, schema: UserSchema},
            {name: Attendance.name, schema: AttendanceSchema}
        ]),
    ],
    controllers: [EventController],
    providers: [
        EventService,
        RewardService,
        RewardTypeService,
        AttendanceStrategy,
        NRUStrategy,
        CBUStrategy,
        RewardConditionEvaluator,
        UserService
    ],
})
export class EventModule {
}
