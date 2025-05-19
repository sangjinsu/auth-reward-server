import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {Model} from "mongoose";
import {RegisterUserDto} from "./dto/register-user.dto";
import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login.dto";
import {JwtService} from './jwt.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) {
    }


    async register(dto: RegisterUserDto) {
        const exist = await this.userModel.findOne({email: dto.email})
        if (exist) {
            throw new ConflictException('이미 존재하는 이메일 입니다.')
        }

        const hash = await bcrypt.hash(dto.password, 10)
        const user = new this.userModel({
            email: dto.email,
            password: hash,
            role: dto.role || 'USER'
        })

        await user.save()

        return {
            message: "회원가입 성공"
        }
    }

    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({email: dto.email});
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        await this.userModel.findByIdAndUpdate(user._id, {lastLoginAt: new Date()});

        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const token = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.refresh(payload)

        await this.userModel.findByIdAndUpdate(user._id, {refreshToken: refreshToken});

        return {
            success: true,
            access_token: token,
        };
    }


    async refresh(userId: string) {

        const user = await this.userModel.findById(userId);
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('유저 정보 또는 refresh token 없음');
        }

        try {
            this.jwtService.verify(user.refreshToken); // refreshToken 만료 검증
        } catch {
            throw new UnauthorizedException('Refresh token 만료됨');
        }

        const newAccessToken = this.jwtService.sign(
            {sub: user._id.toString(), email: user.email, role: user.role},
        );

        return {
            accessToken: newAccessToken,
        };
    }


    async logout(userId: string) {
        await this.userModel.findByIdAndUpdate(userId, {refreshToken: null});
        return {message: '로그아웃 성공'};
    }


    async updateUserRole(userId: string, targetUserId: string, newRole: string) {

        if (userId === targetUserId) {
            throw new UnauthorizedException('Admin은 자신의 Role을 변경할 수 없습니다.');
        }

        const updated = await this.userModel.findByIdAndUpdate(
            targetUserId,
            {role: newRole},
            {new: true},
        );

        if (!updated) {
            throw new Error('해당 사용자를 찾을 수 없습니다.');
        }

        return {
            message: '역할이 성공적으로 변경되었습니다.',
            user: {
                id: updated._id,
                email: updated.email,
                role: updated.role,
            },
        };
    }

    async validateToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token);
            return {valid: true, user: payload};
        } catch {
            return {valid: false};
        }
    }
}
