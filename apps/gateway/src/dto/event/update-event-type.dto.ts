import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateEventTypeDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}