import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class RewardType {
    @Prop({ required: true, unique: true, type: Number })
    type: number;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ type: String })
    description?: string;
}

export type RewardTypeDocument = RewardType & Document;
export const RewardTypeSchema = SchemaFactory.createForClass(RewardType);
