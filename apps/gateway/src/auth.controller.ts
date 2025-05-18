import {Body, Controller, Get, Inject, Post} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {lastValueFrom} from 'rxjs';
import {RegisterUserDto} from './dto/register-user.dto';
import {LoginDto} from './dto/login.dto';
import {ApiTags, ApiOperation} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {
    }


    @Post('register')
    @ApiOperation({summary: '회원가입 요청'})
    async register(@Body() dto: RegisterUserDto) {
        const res = this.authClient.send('auth_register', dto);
        return await lastValueFrom(res);
    }

    @Post('login')
    @ApiOperation({summary: '로그인 요청 및 토큰 발급'})
    async login(@Body() dto: LoginDto) {
        const res = this.authClient.send('auth_login', dto);
        return await lastValueFrom(res);
    }
}
