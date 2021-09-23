import path from 'path';

import { createApp, createCtx, startApp, TCtx, TPatientResource } from '@aidbox/node-server-sdk';
import dotenv from 'dotenv';

import { mergeDeep, TOperation } from './helpers';
import * as patient_portal from './patient-portal/index';
import * as scheduling from './scheduling/index';

const common = {
  manifest: {
    resources: {
      AccessPolicy: {
        'public-operations': {
          engine: 'allow',
          link: [{ resourceType: 'Operation', id: 'app-healthcheck' }],
        },
      },
    },
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
  const manifest = mergeDeep(patient_portal, scheduling, common, { manifest: { apiVersion: 3 } });
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
