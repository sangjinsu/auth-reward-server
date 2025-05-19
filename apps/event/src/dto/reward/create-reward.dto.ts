import {IsNumber} from 'class-validator';


export class CreateRewardDto {
    @IsNumber()
    rewardType: number;

    @IsNumber()
    quantity: number;
}
