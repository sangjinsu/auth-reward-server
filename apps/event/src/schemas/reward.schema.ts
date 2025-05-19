import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reward {
    @Prop({ required: true, type: Types.ObjectId, ref: 'EventSetting' })
    eventId: Types.ObjectId;

    @Prop({
        required: true,
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: 'rewardType은 정수여야 합니다.',
        },
    })
    rewardType: number;

    @Prop({ required: true, type: Number })
    quantity: number;
}

export type RewardDocument = Reward & Document;
export const RewardSchema = SchemaFactory.createForClass(Reward);
