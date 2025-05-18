import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AuthModule);
    const configService = appContext.get(ConfigService);

    const app = await NestFactory.createMicroservice(AuthModule, {
        transport: Transport.TCP,
        options: {
            port: configService.get<number>('AUTH_SERVICE_PORT') || 3001,
        },
    });

    await app.listen();
}
bootstrap();
