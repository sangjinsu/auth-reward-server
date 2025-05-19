import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import {Attendance, AttendanceDocument} from "../schemas/attendance.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Attendance.name) private readonly attendanceModel: Model<AttendanceDocument>
    ) {}

    async isNewUser(userId: string, maxDays: number = 3): Promise<boolean> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

        const created = user.createdAt;
        const diff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= maxDays;
    }

    async isComeBackUser(userId: string, sinceDays: number = 30): Promise<boolean> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

        if (!user.lastLoginAt) return true;

        const diff = (Date.now() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= sinceDays;
    }

    async validateUserAttendance(
        userId: string,
        params: { days: number; startDate: Date; endDate: Date },
    ): Promise<boolean> {
        const { days, startDate, endDate } = params;

        // 출석 기록 조회 (이벤트 기간 내)
        const records = await this.attendanceModel.find({
            userId,
            date: { $gte: startDate, $lte: endDate },
        });

        if (!records.length) return false;

        const formatDate = (d: Date) => d.toISOString().slice(0, 10);
        const attendanceSet = new Set(records.map(r => formatDate(r.date)));

        let maxStreak = 0;
        let currentStreak = 0;

        const cursor = new Date(startDate);

        while (cursor <= endDate) {
            const key = formatDate(cursor);

            if (attendanceSet.has(key)) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }

            cursor.setDate(cursor.getDate() + 1);
        }

        return maxStreak >= days;
    }

}
