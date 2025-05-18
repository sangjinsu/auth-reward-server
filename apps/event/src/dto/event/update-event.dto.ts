import { IsOptional, IsString, IsDateString, IsIn, IsObject } from 'class-validator';

export class UpdateEventDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsObject()
    condition?: {
        type: string;
        params: Record<string, any>;
    };

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsIn(['Active', 'NonActive'])
    status?: 'Active' | 'NonActive';
}
