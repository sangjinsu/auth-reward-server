import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema()
export class Attendance {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true, type: Date })
    date: Date;
}
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
export type AttendanceDocument = Attendance & Document;
