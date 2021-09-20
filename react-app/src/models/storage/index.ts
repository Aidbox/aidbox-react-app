import { createDomain } from 'effector';
import { persist } from 'effector-storage/local';

export const storageDomain = createDomain('storage');
export const removeFromStorage = storageDomain.createEvent<any>('removeFromStorage');
export const insertIntoStorage = storageDomain.createEvent<any>('insertIntoStorage');
export const $storage = storageDomain
  .createStore<{ [key: string]: string }>({})
  .on(insertIntoStorage, (state, { key, value }) => ({ ...state, [key]: value }))
  .on(removeFromStorage, (state, key) => {
    return Object.keys(state)
      .filter((k) => k !== key)
      .reduce((acc, k) => ({ ...acc, [k]: state[k] }), {});
  });

persist({ store: $storage });
