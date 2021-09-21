import { createApp, createCtx, startApp, TCtx, TPatientResource } from '@aidbox/node-server-sdk';
import * as patient_portal from './patient-portal/index';
import * as scheduling from './scheduling/index';
import { mergeDeep, TOperation } from './helpers';
import dotenv from 'dotenv';
import path from 'path';

const common = {
  manifest: {
    operations: {
      'app-healthcheck': {
        method: 'GET',
        path: ['app-healthcheck'],
        handlerFn: async (_: any, { ctx }: { ctx: TCtx }) => {
          return { resource: {} };
        },
      } as TOperation,
    },
  },
};

const main = async () => {
  const isDev = process.env.NODE_ENV === 'development';
  dotenv.config({
    path: isDev ? path.resolve(__dirname, '..', '..', '.env') : undefined,
  });

  // Init app
  const manifest = mergeDeep(patient_portal, scheduling, common, { apiVersion: 2 });
  const ctx = createCtx(manifest);
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
