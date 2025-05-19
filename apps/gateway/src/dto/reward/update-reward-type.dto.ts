import { IsOptional, IsNumber, IsString, IsObject } from 'class-validator';

export class UpdateRewardTypeDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
