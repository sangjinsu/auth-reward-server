import {Injectable} from "@nestjs/common";
import {RewardConditionStrategy} from "./reward-condition.strategy";
import {UserService} from "../services/user.service";

@Injectable()
export class AttendanceStrategy implements RewardConditionStrategy {
    constructor(private readonly userService: UserService) {
    }

    async validate(userId: string, params: {
        days: number,
        startDate: Date,
        endDate: Date
    }) {
        return this.userService.validateUserAttendance(userId, params);
    }
}
