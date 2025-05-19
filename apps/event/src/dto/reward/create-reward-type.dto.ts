import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateRewardTypeDto {
    @IsNumber()
    type: number;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
