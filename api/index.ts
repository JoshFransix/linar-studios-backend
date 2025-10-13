import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: any = null;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.enableCors();
    await app.init();
    cachedServer = serverless(expressApp);
  }
  return cachedServer;
}

// Vercel expects a default export (req, res)
export default async function handler(req: any, res: any) {
  const server = await bootstrapServer();
  return server(req, res);
}
