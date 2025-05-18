import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true, unique: true, index: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'], default: 'USER'})
    role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}

export const UserSchema = SchemaFactory.createForClass(User);
