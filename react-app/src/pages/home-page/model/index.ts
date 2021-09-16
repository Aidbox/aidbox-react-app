import { sample, createDomain } from 'effector';
import { createGate } from 'effector-react';
import { box } from './../../../lib/box';

const domain = createDomain('home-page');

const downloadDataFx = domain.createEffect({
  name: 'downloadDataFx',
  handler: async () => {
    // await box.authorize({ username: 'admin', password: 'secret' });
    const res = await box.request('/testApi');
    /* const res = await fetch('http://localhost:8888/testApi', {
      headers: {
        Authorization: 'Basic cm9vdDpzZWNyZXQ=',
      },
    }); */

    return res;
  },
});

export const $patients = domain.createStore([]);

$patients.on(downloadDataFx.doneData, (store, { data: { patients } }) => patients);

export const downloadData = domain.createEvent('downloadData');

export const Gate = createGate();

sample({
  clock: Gate.open,
  source: $patients,
  target: downloadDataFx,
});
