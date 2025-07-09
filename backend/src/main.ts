// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();             // ← allow your frontend to fetch
  app.setGlobalPrefix('api');   // ← prefixes all routes with /api
  await app.listen(3000);
}
bootstrap();