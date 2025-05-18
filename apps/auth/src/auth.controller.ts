import {Controller, Inject} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {LoginDto} from "./dto/login.dto";
import {RegisterUserDto} from "./dto/register-user.dto";
import {AuthService} from "./auth.service";

@Controller()
export class AuthController {

    constructor(
        private authService: AuthService
    ) {
    }

    @MessagePattern('auth_ping')
    ping() {
        return {valid: true};
    }

    @MessagePattern('auth_register')
    async register(@Payload() dto: RegisterUserDto) {
        return this.authService.register(dto);
    }

    @MessagePattern('auth_login')
    async login(@Payload() dto: LoginDto) {
        return this.authService.login(dto);
    }

}
