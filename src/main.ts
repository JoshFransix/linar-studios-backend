/* eslint-disable @typescript-eslint/no-floating-promises */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enhanced CORS configuration - REMOVE TRAILING SLASH
  app.enableCors({
    origin: [
      'http://localhost:9000', // local frontend
      'https://www.linarstudios.com', // ✅ Remove trailing slash
      'https://linar-studios.vercel.app', // deployed frontend alternative
      process.env.FRONTEND_URL, // dynamic from env
    ].filter(Boolean), // ✅ Remove any undefined values
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
    ],
    credentials: true,
  });

  // ✅ Render automatically provides PORT
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Backend running on port ${port}`);
  console.log(
    `✅ CORS enabled for: ${[
      'http://localhost:9000',
      'https://www.linarstudios.com',
      'https://linar-studios.vercel.app',
      process.env.FRONTEND_URL,
    ]
      .filter(Boolean)
      .join(', ')}`,
  );
}

bootstrap();
