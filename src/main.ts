import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotEnv from 'dotenv';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const result = dotEnv.config();
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
