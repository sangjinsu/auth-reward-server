import { NestFactory } from '@nestjs/core';
import {GatewayModule} from "./gateway.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const config = new DocumentBuilder()
      .setTitle('Gateway API')
      .setDescription('MSA Gateway 서비스')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
