import 'reflect-metadata';
import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createNestApp } from '../src/main';

let cachedServer: any = null;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await createNestApp(new ExpressAdapter(expressApp));
    await app.init();
    cachedServer = serverless(expressApp);
  }
  return cachedServer;
}

export default async function handler(req: Request, res: Response) {
  const server = await bootstrapServer();
  return server(req, res);
}
