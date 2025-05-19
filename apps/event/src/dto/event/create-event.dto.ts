import {
    IsString,
    IsDateString,
    IsObject,
    IsIn,
    IsNumber,
} from 'class-validator';

export class CreateEventDto {
    @IsString()
    eventType: string;

    @IsString()
    title: string;

    @IsObject()
    condition: {
        type: string;
        params: Record<string, any>;
    };

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsIn(['Active', 'NonActive'])
    status: 'Active' | 'NonActive';

    @IsString()
    userId: string;
}
