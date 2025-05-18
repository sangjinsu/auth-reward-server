import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {AuthService} from "./auth.service";
import {RegisterUserDto} from "../../gateway/src/dto/register-user.dto";
import {LoginDto} from "./dto/login.dto";

@Controller()
export class AuthController {

    constructor(
        private readonly authService: AuthService) {
    }

    @MessagePattern('auth_validate')
    handleValidate() {
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
