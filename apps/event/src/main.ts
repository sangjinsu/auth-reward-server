import {NestFactory} from '@nestjs/core';
import {EventModule} from './event.module';
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(EventModule, {
        transport: Transport.TCP,
        options: {
            port: parseInt(process.env.EVENT_SERVICE_PORT || '3002', 10),
        },
    });
    await app.listen();
}

bootstrap();
