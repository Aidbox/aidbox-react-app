import path from 'path';

import {
  createApp,
  createCtx,
  startApp,
  TCtx,
  TManifestOperation,
  TOperationRequestType,
} from '@aidbox/node-server-sdk';
import { TManifestProps } from '@aidbox/node-server-sdk/build/src/manifest';
import { axiosInstance } from 'aidbox-react/lib/services/instance';
import dotenv from 'dotenv';

import { appointmentFind, appointmentBook } from './operations';

export type TOperation<T extends TOperationRequestType = any> = TManifestOperation<T>;

export const manifest: TManifestProps = {
  appId: 'scheduling',
  apiVersion: 1,
  resources: {
    AccessPolicy: {
      'scheduling-public-operations': {
        engine: 'allow',
        link: [{ resourceType: 'Operation', id: 'scheduling-app-healthcheck' }],
      },
    },
  },
  entities: {
    HealthcareService: {
      attrs: {
        duration: {
          type: 'integer',
          description: 'Length of service in minutes',
          extensionUrl: 'urn:extensions:healthcare-service-duration',
        },
      },
    },
  },
  operations: {
    'appointment-book': appointmentBook,
    'appointment-find': appointmentFind,
    'scheduling-app-healthcheck': {
      method: 'GET',
      path: ['scheduling-app-healthcheck'],
      handlerFn: async (_: any, { ctx }: { ctx: TCtx }) => {
        return { resource: {} };
      },
    } as TOperation,
  },
};

const main = async () => {
  const isDev = process.env.NODE_ENV === 'development';
  dotenv.config({
    path: isDev ? path.resolve(__dirname, '..', '..', '.env') : undefined,
  });

  // Init app
  const ctx = createCtx({ manifest });
  const app = createApp({ ctx, helpers: {} });

  // Start app
  const port = +(process.env.APP_PORT || process.env.PORT || 3000);

  try {
    await startApp(app, port);
    axiosInstance.defaults.auth = ctx.client.defaults.auth;
    axiosInstance.defaults.baseURL = ctx.client.defaults.baseURL;
  } catch (e: any) {
    console.dir(e);
    console.log(e.response.data);
  }
};

if (require.main === module) {
  main();
}
