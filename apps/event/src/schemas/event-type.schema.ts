import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type EventTypeDocument = EventType & Document;

@Schema({timestamps: true})
export class EventType {
    @Prop({required: true, unique: true, type: String})
    type: number;

    @Prop({required: true, type: String})
    name: string;

    @Prop({type: String})
    description?: string;
}

export const EventTypeSchema = SchemaFactory.createForClass(EventType);