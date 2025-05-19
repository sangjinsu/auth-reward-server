import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventSettingDocument = EventSetting & Document;

@Schema({ timestamps: true })
export class EventSetting {
    @Prop({ required: true, type: Types.ObjectId, ref: 'EventType' })
    eventType: Types.ObjectId;

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

    @Prop({ required: true, type: Date })
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

EventSettingSchema.index({ eventType: 1 });
EventSettingSchema.index({ startDate: 1 });
EventSettingSchema.index({ endDate: 1 });
