import {Injectable} from "@nestjs/common";
import {EventTypeEnum} from "../enums/event-type.enum";
import {RewardConditionStrategy} from "../strategy/reward-condition.strategy";
import {AttendanceStrategy} from "../strategy/attendance.strategy";
import {NRUStrategy} from "../strategy/nru.strategy";
import {CBUStrategy} from "../strategy/cbu.strategy";

@Injectable()
export class RewardConditionEvaluator {
    private readonly strategies: Record<EventTypeEnum, RewardConditionStrategy>;

    constructor(
        attendance: AttendanceStrategy,
        nru: NRUStrategy,
        cbu: CBUStrategy,
    ) {
        this.strategies = {
            [EventTypeEnum.ATTENDANCE]: attendance,
            [EventTypeEnum.NRU]: nru,
            [EventTypeEnum.CBU]: cbu,
        };
    }

    async evaluate(
        eventType: EventTypeEnum,
        userId: string,
        params: Record<string, any>,
    ): Promise<boolean> {
        const strategy = this.strategies[eventType];
        if (!strategy) throw new Error(`지원하지 않는 이벤트 타입: ${eventType}`);
        return strategy.validate(userId, params);
    }
}
