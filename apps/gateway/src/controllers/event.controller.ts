import {
    Body,
    Controller, Delete, Get, Param, Patch,
    Post, Query, Req,
    UseGuards,
} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {Inject} from '@nestjs/common';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {CreateEventDto} from '../dto/event/create-event.dto';
import {lastValueFrom} from 'rxjs';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
    ApiResponse,
    ApiBody, ApiQuery, ApiParam,
} from '@nestjs/swagger';
import {FindEventQueryDto} from "../dto/event/find-event.query.dto";
import {UpdateEventDto} from "../dto/event/update-event.dto";
import {CreateRewardTypeDto} from "../dto/reward/create-reward-type.dto";
import {UpdateRewardTypeDto} from "../dto/reward/update-reward-type.dto";
import {RolesGuardFactory} from "../guards/roles.guard";
import {Request} from "express";

@ApiTags('Event')
@ApiBearerAuth()
@Controller('events')
export class EventController {
    constructor(
        @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
    ) {
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['OPERATOR', 'ADMIN']))
    @ApiOperation({summary: '이벤트 등록 (OPERATOR, ADMIN)'})
    @ApiBody({
        type: CreateEventDto,
        examples: {
            default: {
                summary: '이벤트 생성 예시',
                value: {
                    type: 1001,
                    title: '출석 이벤트',
                    condition: {
                        type: 'attendance',
                        params: {
                            days: 7,
                        },
                    },
                    startDate: '2025-05-20T00:00:00Z',
                    endDate: '2025-05-27T00:00:00Z',
                    status: 'Active',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: '이벤트 등록 성공',
        schema: {
            example: {
                message: '이벤트가 성공적으로 등록되었습니다.',
                eventId: '665f123456789abcdef01234',
            },
        },
    })
    async createEvent(
        @Req () req: Request & { userId?: string },
        @Body() dto: CreateEventDto
    ) {
        const res = this.eventClient.send('event_create', {
            ...dto,
            userId: req.userId,
        });
        return await lastValueFrom(res);
    }


    @Get()
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['OPERATOR', 'ADMIN']))
    @ApiOperation({summary: '이벤트 목록 조회 (필터링 가능)'})
    @ApiQuery({name: 'type', required: false})
    @ApiQuery({name: 'status', required: false, enum: ['Active', 'NonActive']})
    @ApiQuery({name: 'startDate', required: false, description: 'ISO 문자열'})
    @ApiQuery({name: 'endDate', required: false, description: 'ISO 문자열'})
    @ApiResponse({status: 200, description: '이벤트 목록 배열'})
    async findAll(@Query() query: FindEventQueryDto) {
        const res = this.eventClient.send('event_find_all', query);
        return await lastValueFrom(res);
    }


    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['OPERATOR', 'ADMIN']))
    @ApiOperation({summary: '이벤트 상세 조회'})
    @ApiParam({name: 'id', description: '이벤트 ID'})
    @ApiResponse({
        status: 200,
        description: '이벤트 상세 정보',
    })
    async findById(@Param('id') id: string) {
        const res = this.eventClient.send('event_find_by_id', id);
        return await lastValueFrom(res);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['OPERATOR', 'ADMIN']))
    @ApiOperation({summary: '이벤트 수정'})
    @ApiParam({name: 'id', description: '이벤트 ID'})
    @ApiBody({
        type: UpdateEventDto,
        examples: {
            default: {
                summary: '수정 예시',
                value: {
                    title: '수정된 출석 이벤트',
                    status: 'NonActive',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: '이벤트 수정 성공',
    })
    async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
        const res = this.eventClient.send('event_update_by_id', {id, dto});
        return await lastValueFrom(res);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['OPERATOR', 'ADMIN']))
    @ApiOperation({summary: '이벤트 삭제 (OPERATOR, ADMIN)'})
    @ApiParam({name: 'id', description: '이벤트 ID'})
    @ApiResponse({
        status: 200,
        description: '이벤트 삭제 성공',
        schema: {
            example: {
                message: '이벤트가 성공적으로 삭제되었습니다.',
                eventId: '665fd9fefa12345678901234',
            },
        },
    })
    async delete(@Param('id') id: string) {
        const res = this.eventClient.send('event_delete_by_id', id);
        return await lastValueFrom(res);
    }
}
