import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UseGuards,
    Param, Inject,
} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {lastValueFrom} from 'rxjs';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation, ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {Request} from 'express';
import {RegisterUserDto} from './dto/register-user.dto';
import {LoginDto} from './dto/login.dto';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {RolesGuard} from "./guards/roles.guard";
import {Roles} from "./decorators/roles.decorator";


@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {
    }

    @Post('register')
    @ApiOperation({summary: '회원가입 요청'})
    @ApiBody({
        type: RegisterUserDto,
        examples: {
            default: {
                summary: '회원가입 예시',
                value: {
                    email: 'test@example.com',
                    password: 'securepass123',
                    role: 'USER',
                },
            },
        },
    })
    @ApiResponse({status: 201, description: '회원가입 성공'})
    async register(@Body() dto: RegisterUserDto) {
        const res = this.authClient.send('auth_register', dto);
        return await lastValueFrom(res);
    }

    @Post('login')
    @ApiOperation({summary: '로그인 후 토큰 발급'})
    @ApiBody({
        type: LoginDto,
        examples: {
            default: {
                summary: '로그인 예시',
                value: {
                    email: 'test@example.com',
                    password: 'securepass123',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        },
    })
    async login(@Body() dto: LoginDto) {
        const res = this.authClient.send('auth_login', dto);
        return await lastValueFrom(res);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: 'JWT 토큰 기반 내 정보 조회'})
    @ApiResponse({
        status: 200,
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
    getProfile(@Req() req: Request & { user?: any }) {
        return {
            message: '인증된 사용자 정보입니다.',
            user: req.user,
        };
    }

    @Patch('users/:id/role')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: '유저 역할(Role) 변경 (ADMIN 전용)' })
    @ApiParam({
        name: 'id',
        description: '유저 ID',
        example: '663fd9dd9fdf26dccc7e9864',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                role: {
                    type: 'string',
                    enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'],
                    example: 'OPERATOR',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: '역할 변경 성공',
        schema: {
            example: {
                message: '역할이 성공적으로 변경되었습니다.',
                user: {
                    id: '663fd9dd9fdf26dccc7e9864',
                    email: 'admin@example.com',
                    role: 'OPERATOR',
                },
            },
        },
    })
    async updateRole(
        @Param('id') userId: string,
        @Body() body: { role: string },
    ) {
        const res = this.authClient.send('auth_update_role', {
            userId,
            role: body.role,
        });
        return await lastValueFrom(res);
    }
}
