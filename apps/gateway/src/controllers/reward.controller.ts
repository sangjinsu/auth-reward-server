import {Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateRewardTypeDto} from "../dto/reward/create-reward-type.dto";
import {lastValueFrom} from "rxjs";
import {UpdateRewardTypeDto} from "../dto/reward/update-reward-type.dto";
import {ClientProxy} from "@nestjs/microservices";
import {RolesGuardFactory} from "../guards/roles.guard";
import {UpdateRewardDto} from "../dto/reward/update-reward.dto";
import {CreateRewardDto} from "../dto/reward/create-reward.dto";

@ApiTags('Reward')
@ApiBearerAuth()
@Controller()
export class RewardController {

    constructor(
        @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
    ) {
    }


    @Post('events/:eventId/rewards')
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['ADMIN', 'OPERATOR']))
    @ApiOperation({ summary: '보상 등록 (ADMIN, OPERATOR)' })
    @ApiParam({ name: 'eventId', description: '이벤트 ObjectId' })
    @ApiBody({
        type: CreateRewardDto,
        examples: {
            default: {
                value: {
                    rewardType: 1,
                    quantity: 100,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: '보상 등록 성공',
        schema: {
            example: {
                message: '보상이 등록되었습니다.',
                rewardId: '665fabc123...',
                rewardType: 1,
                quantity: 100,
            },
        },
    })
    async createReward(
        @Param('eventId') eventId: string,
        @Body() dto: CreateRewardDto,
    ) {
        const res = this.eventClient.send('reward_create', { eventId, dto });
        return await lastValueFrom(res);
    }

    @Get('events/:eventId/rewards')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '이벤트별 보상 목록 조회' })
    @ApiParam({ name: 'eventId', description: '이벤트 ObjectId' })
    @ApiResponse({
        status: 200,
        description: '보상 목록 배열',
        schema: {
            example: [
                {
                    _id: '665fab123...',
                    rewardType: 1,
                    quantity: 100,
                    metadata: {
                        name: '100포인트',
                        code: 'POINT100',
                    },
                },
            ],
        },
    })
    async findRewardsByEvent(@Param('eventId') eventId: string) {
        const res = this.eventClient.send('reward_find_by_event', eventId);
        return await lastValueFrom(res);
    }

    @Get('rewards/:id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '보상 단일 조회' })
    @ApiParam({ name: 'id', description: 'Reward ObjectId' })
    @ApiResponse({
        status: 200,
        description: '보상 상세 정보',
        schema: {
            example: {
                _id: '665fab123...',
                rewardType: 1,
                quantity: 100,
                metadata: {
                    name: '100포인트',
                    code: 'POINT100',
                },
            },
        },
    })
    async findReward(@Param('id') id: string) {
        const res = this.eventClient.send('reward_find_by_id', id);
        return await lastValueFrom(res);
    }

    @Get('rewards')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '보상 전체 조회' })
    async findAllRewards() {
        const res = this.eventClient.send('reward_find_all', {});
        return await lastValueFrom(res);
    }


    @Patch('rewards/:id')
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['ADMIN', 'OPERATOR']))
    @ApiOperation({ summary: '보상 수정 (ADMIN, OPERATOR)' })
    @ApiParam({ name: 'id', description: 'Reward ObjectId' })
    @ApiBody({
        type: UpdateRewardDto,
        examples: {
            default: {
                value: {
                    quantity: 200,
                    metadata: {
                        name: '200포인트',
                        code: 'POINT200',
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: '보상 수정 성공',
    })
    async updateReward(
        @Param('id') id: string,
        @Body() dto: UpdateRewardDto,
    ) {
        const res = this.eventClient.send('reward_update_by_id', { id, dto });
        return await lastValueFrom(res);
    }

    @Delete('rewards/:id')
    @UseGuards(JwtAuthGuard, RolesGuardFactory(['ADMIN', 'OPERATOR']))
    @ApiOperation({ summary: '보상 삭제 (ADMIN, OPERATOR)' })
    @ApiParam({ name: 'id', description: 'Reward ObjectId' })
    @ApiResponse({
        status: 200,
        description: '보상 삭제 성공',
        schema: {
            example: {
                message: '보상이 삭제되었습니다.',
                id: '665fab123...',
            },
        },
    })
    async deleteReward(@Param('id') id: string) {
        const res = this.eventClient.send('reward_delete_by_id', id);
        return await lastValueFrom(res);
    }
}

