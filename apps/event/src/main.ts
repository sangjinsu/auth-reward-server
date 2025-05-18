import { NestFactory } from '@nestjs/core';
import { EventModule } from './event.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(EventModule);
    const configService = appContext.get(ConfigService);

    const app = await NestFactory.createMicroservice(EventModule, {
        transport: Transport.TCP,
        options: {
            port: configService.get<number>('EVENT_SERVICE_PORT') || 3002,
        },
    });

    await app.listen();
}

bootstrap();
