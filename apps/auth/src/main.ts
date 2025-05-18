import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions} from '@nestjs/microservices';
import {ConfigService} from '@nestjs/config';
import {AuthModule} from "./auth.module";

async function bootstrap() {
    const app = await NestFactory.create(AuthModule);
    const configService = app.get(ConfigService);
    const host = configService.get<string>('AUTH_SERVICE_HOST') || '127.0.0.1';
    const port = configService.get<number>('AUTH_SERVICE_PORT') || 3001;

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