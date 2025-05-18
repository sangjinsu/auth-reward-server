import {Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {RolesGuard} from "./guards/roles.guard";
import {Roles} from "./decorators/roles.decorator";
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateRewardTypeDto} from "./dto/reward/create-reward-type.dto";
import {lastValueFrom} from "rxjs";
import {UpdateRewardTypeDto} from "./dto/reward/update-reward-type.dto";
import {ClientProxy} from "@nestjs/microservices";

@ApiTags('RewardType')
@Controller('reward-type')
export class RewardTypeController {

    constructor(
        @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
    ) {
    }


    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({summary: '보상 타입 등록 (ADMIN 전용)'})
    @ApiBody({
        type: CreateRewardTypeDto,
        examples: {
            default: {
                value: {
                    type: 1,
                    name: '포인트',
                    description: '게임 포인트 보상',
                },
            },
        },
    })
    @ApiResponse({status: 201, description: 'RewardType 생성 성공'})
    async create(@Body() dto: CreateRewardTypeDto) {
        const res = this.eventClient.send('reward_type_create', dto);
        return await lastValueFrom(res);
    }


    @Get()
    @ApiOperation({summary: 'RewardType 전체 목록 조회'})
    @ApiResponse({
        status: 200,
        description: 'RewardType 배열 반환',
        schema: {
            example: [
                {
                    type: 1,
                    name: '포인트',
                    description: '게임 포인트 보상'
                },
                {
                    type: 2,
                    name: '아이템',
                    description: '인게임 아이템',
                },
            ],
        },
    })
    async findAllRewardType() {
        const res = this.eventClient.send('reward_type_find_all', {});
        return await lastValueFrom(res);
    }


    @Get(':id')
    @ApiOperation({summary: 'RewardType 단일 조회'})
    @ApiParam({name: 'id', description: 'RewardType ObjectId'})
    @ApiResponse({
        status: 200,
        description: 'RewardType 정보 반환',
        schema: {
            example: {
                _id: '665fb2f4ab1234567890abcd',
                type: 1,
                name: '포인트',
                description: '게임 포인트 보상',
                createdAt: '2025-05-20T10:00:00.000Z',
                updatedAt: '2025-05-20T10:00:00.000Z',
            },
        },
    })
    async findRewardTypeById(@Param('id') id: string) {
        const res = this.eventClient.send('reward_type_find_by_id', id);
        return await lastValueFrom(res);
    }


    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({summary: 'RewardType 수정 (ADMIN 전용)'})
    @ApiParam({name: 'id', description: 'RewardType ObjectId'})
    @ApiBody({
        type: UpdateRewardTypeDto,
        examples: {
            default: {
                value: {
                    name: '보너스 포인트',
                    description: '포인트 보상의 새로운 설명',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'RewardType 수정 성공',
    })
    async updateRewardType(
        @Param('id') id: string,
        @Body() dto: UpdateRewardTypeDto,
    ) {
        const res = this.eventClient.send('reward_type_update_by_id', {id, dto});
        return await lastValueFrom(res);
    }


    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({summary: 'RewardType 삭제 (ADMIN 전용)'})
    @ApiParam({name: 'id', description: 'RewardType ObjectId'})
    @ApiResponse({
        status: 200,
        description: '삭제 성공',
        schema: {
            example: {
                message: 'RewardType이 성공적으로 삭제되었습니다.',
                id: '665fb2f4ab1234567890abcd',
            },
        },
    })
    async deleteRewardType(@Param('id') id: string) {
        const res = this.eventClient.send('reward_type_delete_by_id', id);
        return await lastValueFrom(res);
    }
}
