import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {Model} from "mongoose";
import {RegisterUserDto} from "./dto/register-user.dto";
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {
    }


    async register(dto: RegisterUserDto) {
        const exist = await this.userModel.findOne({email: dto.email})
        if (exist) {
            throw new ConflictException('이미 존재하는 이메일 입니다.')
        }

        const hash = await bcrypt.hash(dto.password, 10)
        const user = new this.userModel({
            email: dto.email,
            password: hash,
            role: dto.role || 'USER'
        })

        await user.save()

        return {
            message: "회원가입 성공"
        }
    }

    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({email: dto.email});
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
        };
    }
}
