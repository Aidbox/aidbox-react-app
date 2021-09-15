import { createApp, createCtx, startApp } from '@aidbox/node-server-sdk';
import * as operations from './operations';
import dotenv from 'dotenv';
import path from 'path';

const main = async () => {
  const isDev = process.env.NODE_ENV === 'development';
  dotenv.config({
    path: isDev ? path.resolve(__dirname, '..', '..', '.env') : undefined,
  });

  // Init app
  const ctx = createCtx({
    manifest: { resources: { Patient: { 'pt-100': { gender: 'male' } } }, operations, apiVersion: 2 },
  });
  const app = createApp({ ctx, helpers: {} });

  // Start app
  const port = +(process.env.APP_PORT || process.env.PORT || 3000);
  try {
    await startApp(app, port);
  } catch (e) {
    console.dir(e);
  }
};

if (require.main === module) {
  main();
}
