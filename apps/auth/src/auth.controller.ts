import {ConflictException, Controller} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {Model} from "mongoose";
import { JwtService } from './jwt.service';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
        this.authService = new AuthService(this.userModel, new JwtService());
    }

    @MessagePattern('auth_ping')
    ping() {
        return { valid: true };
    }

    @MessagePattern('auth_register')
    async register(@Payload() dto: RegisterUserDto) {
        try {
            return await this.authService.register(dto);
        } catch (error) {
            if (error instanceof ConflictException) {
                return { error: '이미 존재하는 이메일 입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('auth_login')
    async login(@Payload() dto: LoginDto) {
        try {
            return await this.authService.login(dto);
        } catch (error) {
            if (error instanceof ConflictException) {
                return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('auth_validate')
    async validate(@Payload() data: { token: string }) {
        try {
            return await this.authService.validateToken(data.token);
        } catch (error) {
            if (error instanceof ConflictException) {
                return { error: '유효하지 않은 토큰입니다.' };
            }
            throw error;
        }
    }

    @MessagePattern('auth_update_role')
    async updateRole(@Payload() payload: { userId: string; targetUserId: string, role: string }) {
        try {
            return await this.authService.updateUserRole(payload.userId, payload.targetUserId, payload.role);
        } catch (error) {
            if (error instanceof ConflictException) {
                return { error: '유효하지 않은 토큰입니다.' };
            }
            throw error;
        }
    }
}
