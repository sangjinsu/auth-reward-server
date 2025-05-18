import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions} from '@nestjs/microservices';
import {ConfigService} from '@nestjs/config';
import {AuthModule} from "./auth.module";

async function bootstrap() {
    const app = await NestFactory.create(AuthModule);
    const configService = app.get(ConfigService);
    const host = configService.get<string>('AUTH_HOST') || 'localhost';
    const port = configService.get<number>('AUTH_PORT') || 3001;

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: host,
            port: port,
        },
    });

    await app.startAllMicroservices();
}

bootstrap();