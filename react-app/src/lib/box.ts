import Client, { Types } from '@aidbox/client-sdk-js';
import { env } from '../env';

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
    return localStorage.setItem(key, value);
  },
  obtainFromStorage(key: string) {
    return localStorage.getItem(key);
  },
  removeFromStorage(key: string) {
    localStorage.removeItem(key);
  },
};

export const box = Client.initializeInstance(credentials, storage) as Types.TPublicAPI;
