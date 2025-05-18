import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventSettingDocument = EventSetting & Document;

@Schema({ timestamps: true })
export class EventSetting {
    @Prop({ required: true, type: Number }) // ✅ 명시적 타입 지정
    type: number;

    @Prop({ required: true, type: String })
    title: string;

    @Prop({
        type: {
            type: String,
            required: true,
        },
        params: {
            type: Object,
        },
    })
    condition: {
        type: string;
        params: Record<string, any>;
    };

    @Prop({ required: true, type: Date }) // ✅ Date 명시
    startDate: Date;

    @Prop({ required: true, type: Date })
    endDate: Date;

    @Prop({
        enum: ['Active', 'NonActive'],
        default: 'NonActive',
        type: String,
    })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const EventSettingSchema = SchemaFactory.createForClass(EventSetting);

// ✅ 조회 최적화를 위한 인덱스 설정
EventSettingSchema.index({ type: 1 });
EventSettingSchema.index({ startDate: 1 });
EventSettingSchema.index({ endDate: 1 });
