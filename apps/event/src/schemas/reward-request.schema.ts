import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({timestamps: true})
export class RewardRequest {
    @Prop({required: true, type: Types.ObjectId, ref: 'User'})
    userId: Types.ObjectId;

    @Prop({required: true, type: Types.ObjectId, ref: 'EventSetting'})
    eventId: Types.ObjectId;

    @Prop({type: [Types.ObjectId], ref: 'Reward'})
    rewardIds: Types.ObjectId[];

    @Prop({
        required: true,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'REJECTED'],
        type: String,
        default: 'PENDING',
    })
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REJECTED';

    @Prop({type: String})
    failureReason?: string;

    @Prop({required: true, type: Date})
    requestedAt: Date;

    @Prop({type: Date})
    evaluatedAt: Date;

    @Prop({type: Date})
    readonly createdAt: Date;

    @Prop({type: Date})
    readonly updatedAt: Date;
}

export type RewardRequestDocument = RewardRequest & Document;
export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
RewardRequestSchema.index({userId: 1, eventId: 1}, {unique: true});
RewardRequestSchema.index({requestedAt: 1})
