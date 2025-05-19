export interface RewardConditionStrategy {
    validate(userId: string, params: Record<string, any>): Promise<boolean>;
}
