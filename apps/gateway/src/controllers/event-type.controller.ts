import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    Inject,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuardFactory } from '../guards/roles.guard';
import {CreateEventTypeDto} from "../dto/event/create-event-type.dto";
import {UpdateEventTypeDto} from "../dto/event/update-event-type.dto";


@ApiTags('EventType')
@ApiBearerAuth()
@Controller('event-types')
export class EventTypeController {
    constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['ADMIN']))
    @ApiOperation({ summary: '이벤트 타입 등록 (ADMIN 전용)' })
    @ApiBody({
        type: CreateEventTypeDto,
        examples: {
            default: {
                value: {
                    type: 1,
                    name: '출석',
                    description: '출석 이벤트 전용 타입',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'EventType 생성 성공' })
    async create(@Body() dto: CreateEventTypeDto) {
        const res = this.eventClient.send('event_type_create', dto);
        return await lastValueFrom(res);
    }

    @Get()
    @ApiOperation({ summary: '이벤트 타입 전체 목록 조회' })
    @ApiResponse({
        status: 200,
        description: 'EventType 배열 반환',
        schema: {
            example: [
                {
                    type: 1,
                    name: '출석',
                    description: '출석 이벤트',
                },
                {
                    type: 2,
                    name: '결제',
                    description: '결제 누적 이벤트',
                },
            ],
        },
    })
    async findAllEventTypes() {
        const res = this.eventClient.send('event_type_find_all', {});
        return await lastValueFrom(res);
    }

    @Get(':id')
    @ApiOperation({ summary: '이벤트 타입 단일 조회' })
    @ApiParam({ name: 'id', description: 'EventType ObjectId' })
    @ApiResponse({
        status: 200,
        description: 'EventType 정보 반환',
        schema: {
            example: {
                _id: '665fb2f4ab1234567890abcd',
                type: 1,
                name: '출석',
                description: '출석 이벤트',
                createdAt: '2025-05-20T10:00:00.000Z',
                updatedAt: '2025-05-20T10:00:00.000Z',
            },
        },
    })
    async findEventTypeById(@Param('id') id: string) {
        const res = this.eventClient.send('event_type_find_by_id', id);
        return await lastValueFrom(res);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['ADMIN']))
    @ApiOperation({ summary: '이벤트 타입 수정 (ADMIN 전용)' })
    @ApiParam({ name: 'id', description: 'EventType ObjectId' })
    @ApiBody({
        type: UpdateEventTypeDto,
        examples: {
            default: {
                value: {
                    name: '개선된 출석 이벤트',
                    description: '이벤트 타입 이름 및 설명 수정',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'EventType 수정 성공',
    })
    async updateEventType(
        @Param('id') id: string,
        @Body() dto: UpdateEventTypeDto,
    ) {
        const res = this.eventClient.send('event_type_update_by_id', { id, dto });
        return await lastValueFrom(res);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['ADMIN']))
    @ApiOperation({ summary: '이벤트 타입 삭제 (ADMIN 전용)' })
    @ApiParam({ name: 'id', description: 'EventType ObjectId' })
    @ApiResponse({
        status: 200,
        description: '삭제 성공',
        schema: {
            example: {
                message: 'EventType이 성공적으로 삭제되었습니다.',
                id: '665fb2f4ab1234567890abcd',
            },
        },
    })
    async deleteEventType(@Param('id') id: string) {
        const res = this.eventClient.send('event_type_delete_by_id', id);
        return await lastValueFrom(res);
    }
}
