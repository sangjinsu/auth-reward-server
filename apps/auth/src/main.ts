import {NestFactory} from '@nestjs/core';
import {AuthModule} from './auth.module';
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AuthModule, {
        transport: Transport.TCP,
        options: {
            port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
        },
    });
    await app.listen();
}

bootstrap();
