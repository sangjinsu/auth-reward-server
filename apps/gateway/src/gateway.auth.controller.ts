import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class GatewayAuthController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}

    @Post('register')
    @ApiOperation({ summary: '회원가입 요청' })
    @ApiBody({
        type: RegisterUserDto,
        examples: {
            default: {
                summary: '기본 회원가입 예시',
                value: {
                    email: 'user@example.com',
                    password: 'securepass',
                    role: 'USER',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: '회원가입 성공' })
    @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
    async register(@Body() dto: RegisterUserDto) {
        const res = this.authClient.send('auth_register', dto);
        return await lastValueFrom(res);
    }

    @Post('login')
    @ApiOperation({ summary: '로그인 요청 및 토큰 발급' })
    @ApiBody({
        type: LoginDto,
        examples: {
            default: {
                summary: '기본 로그인 예시',
                value: {
                    email: 'user@example.com',
                    password: 'securepass',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'JWT 토큰 발급',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        },
    })
    @ApiResponse({ status: 401, description: '이메일 또는 비밀번호 오류' })
    async login(@Body() dto: LoginDto) {
        const res = this.authClient.send('auth_login', dto);
        return await lastValueFrom(res);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '인증된 사용자 정보 조회' })
    @ApiResponse({
        status: 200,
        description: '토큰에 해당하는 사용자 정보',
        schema: {
            example: {
                _id: '663fd9dd9fdf26dccc7e9864',
                email: 'user@example.com',
                role: 'USER',
                iat: 1716123123,
                exp: 1716209523,
            },
        },
    })
    @ApiResponse({ status: 401, description: '토큰 없음 또는 유효하지 않음' })
    getProfile(@Req() req: Request) {
        return req.user;
    }
}
