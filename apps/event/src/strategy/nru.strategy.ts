import {Injectable} from "@nestjs/common";
import {RewardConditionStrategy} from "./reward-condition.strategy";
import {UserService} from "../services/user.service";

@Injectable()
export class NRUStrategy implements RewardConditionStrategy {
    constructor(private readonly userService: UserService) {}

    async validate(userId: string, params: { days: number }) {
        return this.userService.isNewUser(userId, params.days || 3);
    }
}
