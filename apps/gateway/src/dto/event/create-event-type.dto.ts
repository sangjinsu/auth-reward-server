import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateEventTypeDto {
    @IsNumber()
    type: number;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}