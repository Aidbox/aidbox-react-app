import { createApp, createCtx, startApp } from '@aidbox/node-server-sdk';
import * as patient_portal from './patient-portal/index';
import * as scheduling from './scheduling/index';
import { mergeDeep } from './helpers';
import dotenv from 'dotenv';
import path from 'path';

const main = async () => {
  const isDev = process.env.NODE_ENV === 'development';
  dotenv.config({
    path: isDev ? path.resolve(__dirname, '..', '..', '.env') : undefined,
  });

  // Init app
  const manifest = mergeDeep(patient_portal, scheduling, { manifest: { apiVersion: 3 } });
  const ctx = createCtx(manifest);
  const app = createApp({ ctx, helpers: {} });

  // Start app
  const port = +(process.env.APP_PORT || process.env.PORT || 3000);
  try {
    await startApp(app, port);
  } catch (e) {
    console.dir(e.response);
  }
};

if (require.main === module) {
  main();
}
