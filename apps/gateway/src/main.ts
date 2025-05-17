import { NestFactory } from '@nestjs/core';
import {GatewayModule} from "./gateway.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const config = new DocumentBuilder()
      .setTitle('Reward Gateway API')
      .setDescription('유저 보상 및 이벤트 시스템 Gateway API 문서입니다.')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
