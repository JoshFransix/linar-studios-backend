import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for your Next.js frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:9000', // your Next.js app URL
    credentials: true,
  });

  await app.listen(5000); // or your backend port
}
bootstrap();
