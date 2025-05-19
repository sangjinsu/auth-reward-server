import {Injectable} from "@nestjs/common";
import {RewardConditionStrategy} from "./reward-condition.strategy";
import {UserService} from "../services/user.service";

@Injectable()
export class CBUStrategy implements RewardConditionStrategy {
    constructor(private readonly userService: UserService) {}

    async validate(userId: string, params: { sinceDays: number }) {
        return this.userService.isComeBackUser(userId, params.sinceDays || 30);
    }
}
