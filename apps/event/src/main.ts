import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions} from '@nestjs/microservices';
import {ConfigService} from '@nestjs/config';
import {EventModule} from "./event.module";

async function bootstrap() {
    const app = await NestFactory.create(EventModule);
    const configService = app.get(ConfigService);
    const host = configService.get<string>('EVENT_SERVICE_HOST') || 'localhost';
    const port = configService.get<number>('EVENT_SERVICE_PORT') || 3002;

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