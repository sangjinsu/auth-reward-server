import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, type: String })
    email: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({
        required: true,
        enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'],
        default: 'USER',
        type: String,
    })
    role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}

export const UserSchema = SchemaFactory.createForClass(User);
