import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @MessagePattern('auth_ping')
    ping() {
        return { valid: true };
    }

    @MessagePattern('auth_register')
    async register(@Payload() dto: RegisterUserDto) {
        console.log(this.authService);
        return this.authService.register(dto);
    }

    @MessagePattern('auth_login')
    async login(@Payload() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @MessagePattern('auth_validate')
    async validate(@Payload() data: { token: string }) {
        try {
            const decoded = this.jwtService.verify(data.token);
            return { valid: true, user: decoded };
        } catch {
            return { valid: false };
        }
    }

    @MessagePattern('auth_update_role')
    async updateRole(@Payload() payload: { userId: string; role: string }) {
        return this.authService.updateUserRole(payload.userId, payload.role);
    }
}
