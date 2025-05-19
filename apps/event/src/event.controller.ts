import {Controller, NotFoundException} from '@nestjs/common';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {CreateEventDto} from "./dto/event/create-event.dto";
import {EventService} from "./services/event.service";
import {FindEventQueryDto} from "./dto/event/find-event.query.dto";
import {UpdateEventDto} from "./dto/event/update-event.dto";
import {CreateRewardTypeDto} from "./dto/reward/create-reward-type.dto";
import {RewardTypeService} from "./services/reward-type.service";
import {UpdateRewardTypeDto} from "./dto/reward/update-reward-type.dto";
import {InjectModel} from "@nestjs/mongoose";
import {RewardType, RewardTypeDocument} from "./schemas/reward-type.schema";
import {EventSetting, EventSettingDocument} from "./schemas/event-setting.schema";
import {Model} from "mongoose";
import {CreateRewardDto} from "./dto/reward/create-reward.dto";
import {Reward, RewardDocument} from "./schemas/reward.schema";
import {RewardService} from "./services/reward.service";
import {UpdateRewardDto} from "./dto/reward/update-reward.dto";
import {EventTypeService} from "./services/event-type.service";
import {EventType, EventTypeDocument} from "./schemas/event-type.schema";
import {CreateEventTypeDto} from "./dto/event/create-event-type.dto";
import {UpdateEventTypeDto} from "./dto/event/update-event-type.dto";
import {RewardRequest, RewardRequestDocument} from "./schemas/reward-request.schema";
import {RewardConditionEvaluator} from "./evaluator/reward-condition-evaluator";
import {UserService} from "./services/user.service";
import {Attendance, AttendanceDocument} from "./schemas/attendance.schema";
import {User, UserDocument} from "./schemas/user.schema";
import {AttendanceStrategy} from "./strategy/attendance.strategy";
import {NRUStrategy} from "./strategy/nru.strategy";
import {CBUStrategy} from "./strategy/cbu.strategy";

@Controller()
export class EventController {
    constructor(
        private readonly eventTypeService: EventTypeService,
        private readonly eventService: EventService,
        private readonly rewardTypeService: RewardTypeService,
        private readonly rewardService: RewardService,
        private readonly userService: UserService,
        @InjectModel(EventType.name) private eventTypeModel: Model<EventTypeDocument>,
        @InjectModel(EventSetting.name) private eventModel: Model<EventSettingDocument>,
        @InjectModel(RewardType.name) private rewardTypeModel: Model<RewardTypeDocument>,
        @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
        @InjectModel(RewardRequest.name) private rewardRequestModel: Model<RewardRequestDocument>,
        @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
        this.eventTypeService = new EventTypeService(this.eventTypeModel);
        this.eventService = new EventService(this.eventModel, this.eventTypeModel);
        this.rewardTypeService = new RewardTypeService(this.rewardTypeModel);
        this.userService = new UserService(this.userModel, this.attendanceModel)

        const attendanceStrategy = new AttendanceStrategy(this.userService)
        const nruStrategy = new NRUStrategy(this.userService)
        const cbuStrategy = new CBUStrategy(this.userService)

        this.rewardService = new RewardService(
            this.rewardModel,
            this.eventModel,
            this.rewardTypeModel,
            this.eventTypeModel,
            this.rewardRequestModel,
            new RewardConditionEvaluator(
                attendanceStrategy,
                nruStrategy,
                cbuStrategy
            )
        )
    }

    @MessagePattern('event_ping')
    ping() {
        return {valid: true};
    }

    @MessagePattern('event_create')
    async createEvent(@Payload() dto: CreateEventDto) {
        try {
            return this.eventService.createEvent(dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 이벤트입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('event_find_all')
    async findAllEvent(@Payload() query: FindEventQueryDto) {
        try {
            return this.eventService.findAllEvent(query);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 이벤트입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('event_find_by_id')
    async findById(@Payload() id: string) {
        try {
            return this.eventService.findEventById(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 이벤트입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('event_update_by_id')
    async updateEventById(@Payload() data: { id: string; dto: UpdateEventDto }) {
        try {
            return this.eventService.updateEvent(data.id, data.dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 이벤트입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('event_delete_by_id')
    async deleteEventById(@Payload() id: string) {
        try {
            return this.eventService.deleteEvent(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 이벤트입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_create')
    async createRewardType(@Payload() dto: CreateRewardTypeDto) {
        try {
            return this.rewardTypeService.create(dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 RewardType입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_find_all')
    async findAllRewardType() {
        try {
            return this.rewardTypeService.findAll();
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 RewardType입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_find_by_id')
    async findRewardTypeById(@Payload() rewardType: string) {
        try {
            return this.rewardTypeService.findByRewardType(rewardType);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 RewardType입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_update_by_id')
    async updateRewardTypeById(@Payload() payload: { id: string; dto: UpdateRewardTypeDto }) {
        try {
            return this.rewardTypeService.updateById(payload.id, payload.dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 RewardType입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('reward_type_delete_by_id')
    async deleteRewardTypeById(@Payload() id: string) {
        try {
            return this.rewardTypeService.deleteById(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {error: '존재하지 않는 RewardType입니다.'};
            }
            throw error;
        }
    }

    @MessagePattern('reward_create')
    createReward(@Payload() data: { eventId: string; dto: CreateRewardDto }) {
        try {
            return this.rewardService.createReward(data.eventId, data.dto);
        } catch (error) {

            throw error;
        }
    }


    @MessagePattern('reward_find_by_event')
    findByEvent(@Payload() eventId: string) {
        try {
            return this.rewardService.findByEvent(eventId);
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('reward_find_by_id')
    findRewardById(@Payload() id: string) {
        try {
            return this.rewardService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('reward_find_all')
    findAllReward() {
        try {
            return this.rewardService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('reward_update_by_id')
    updateReward(@Payload() data: { id: string; dto: UpdateRewardDto }) {
        try {
            return this.rewardService.updateById(data.id, data.dto);
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('reward_delete_by_id')
    deleteReward(@Payload() id: string) {
        try {
            return this.rewardService.deleteById(id);
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('event_type_create')
    createEventType(@Payload() dto: CreateEventTypeDto) {
        try {
            return this.eventTypeService.create(dto);
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('event_type_find_all')
    findAllEventType() {
        try {
            return this.eventTypeService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('event_type_find_by_id')
    findEventTypeById(@Payload() id: string) {
        try {
            return this.eventTypeService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('event_type_update_by_id')
    updateEventType(@Payload() payload: { id: string; dto: UpdateEventTypeDto }) {
        try {
            return this.eventTypeService.updateById(payload.id, payload.dto);
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('event_type_delete_by_id')
    deleteEventType(@Payload() id: string) {
        try {
            return this.eventTypeService.deleteById(id);
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('reward_request')
    requestReward(@Payload() data: { eventId: string; userId: string }) {
        try {
            return this.rewardService.requestReward(data.eventId, data.userId);
        } catch (error) {
            throw error;
        }
    }


    @MessagePattern('reward_request_find_me')
    async findMy(@Payload() payload: { userId: string }) {
        return this.rewardService.findMyRewardRequests(payload.userId);
    }

    @MessagePattern('reward_request_find_all')
    async findAll(
        @Payload()
        filters: {
            userId?: string;
            eventId?: string;
            status?: string;
        },
    ) {
        return this.rewardService.findAllRewardRequests(filters);
    }
}
