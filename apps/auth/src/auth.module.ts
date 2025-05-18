import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGO_AUTH_URI'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {
}
