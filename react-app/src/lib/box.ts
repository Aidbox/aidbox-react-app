import Client, { Types } from '@aidbox/client-sdk-js';
import { env } from '../env';

import { removeFromStorage, insertIntoStorage, $storage } from '../models/storage';

const credentials = {
  URL: env.URL,
  CLIENT_ID: env.CLIENT,
  CLIENT_SECRET: env.SECRET,
  AUTH_MODE: 0,
  FHIR_STRICT: false,
};
console.log(credentials);
const storage = {
  insertIntoStorage(key: string, value: string) {
    insertIntoStorage({ key, value });
  },
  obtainFromStorage(key: string) {
    return $storage.getState()[key];
  },
  removeFromStorage(key: string) {
    removeFromStorage(key);
  },
};

export const box = Client.initializeInstance(credentials, storage) as Types.TPublicAPI;
