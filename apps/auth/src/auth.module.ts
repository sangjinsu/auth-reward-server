import * as dotenv from 'dotenv';
dotenv.config()
import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schemas/user.schema";
import {AuthService} from "./auth.service";
import {JwtService} from "./jwt.service";


@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URI),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})
export class AuthModule {
}
