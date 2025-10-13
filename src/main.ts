/* eslint-disable @typescript-eslint/no-floating-promises */
// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';

/**
 * Creates the Nest app, used for both local dev and serverless (Vercel).
 */
export async function createNestApp(expressAdapter?: ExpressAdapter) {
  const app = expressAdapter
    ? await NestFactory.create(AppModule, expressAdapter)
    : await NestFactory.create(AppModule);

  // ✅ Enable CORS for your frontend (Next.js / Vercel domain)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:9000',
    credentials: true,
  });

  await app.init();
  return app;
}

// ✅ Local development (runs only when executed directly)
if (require.main === module) {
  (async () => {
    const app = await createNestApp();
    await app.listen(process.env.PORT || 5000);
    console.log(
      `🚀 Backend running on http://localhost:${process.env.PORT || 5000}`,
    );
  })();
}
