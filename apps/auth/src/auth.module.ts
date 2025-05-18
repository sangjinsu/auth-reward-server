import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schemas/user.schema";
import {JwtModule} from "@nestjs/jwt";
import {AuthService} from "./auth.service";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        ConfigModule.forRoot({isGlobal: true}),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGO_AUTH_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: {expiresIn: config.get('JWT_EXPIRES_IN')},
            }),
            inject: [ConfigService],
        }),
    ],
})

export class AuthModule {
}
