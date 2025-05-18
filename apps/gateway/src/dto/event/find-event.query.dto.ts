import { IsOptional, IsIn, IsDateString, IsNumberString } from 'class-validator';

export class FindEventQueryDto {
    @IsOptional()
    @IsNumberString()
    type?: string;

    @IsOptional()
    @IsIn(['Active', 'NonActive'])
    status?: 'Active' | 'NonActive';

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}
