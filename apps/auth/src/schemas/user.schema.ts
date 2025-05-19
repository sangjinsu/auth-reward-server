import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true, unique: true, type: String})
    email: string;

    @Prop({required: true, type: String})
    password: string;

    @Prop({
        required: true,
        enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'],
        default: 'USER',
        type: String,
    })
    role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';

    @Prop({type: String})
    refreshToken?: string;

    @Prop({type: Date})
    lastLoginAt: Date;

    @Prop({type: Date})
    createdAt: Date;

    @Prop({type: Date})
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
