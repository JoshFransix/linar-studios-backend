/* eslint-disable @typescript-eslint/no-floating-promises */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS (adjust origin as needed)
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // ✅ Render automatically provides a PORT env var
  const port = process.env.PORT || 5000;
  await app.listen(port, () => {
    console.log(`🚀 Backend running on port ${port}`);
  });
}

bootstrap();
