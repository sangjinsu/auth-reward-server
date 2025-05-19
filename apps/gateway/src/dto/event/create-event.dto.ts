import {
    IsString,
    IsDateString,
    IsObject,
    IsIn,
    IsNumber,
} from 'class-validator';

export class CreateEventDto {
    @IsNumber()
    type: number;

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
}
