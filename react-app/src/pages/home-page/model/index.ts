import { sample } from 'effector';
import { createDomain } from 'effector';

const domain = createDomain('home-page');

const downloadDataFx = domain.createEffect({
  name: 'downloadDataFx',
  handler: async () => {
    const res = await fetch('http://localhost:8888/testApi', {
      headers: {
        Authorization: 'Basic cm9vdDpzZWNyZXQ=',
      },
    });
    return res.json();
  },
});

const $patient = domain.createStore({});

$patient.on(downloadDataFx.doneData, (store, payload) => payload);

export const downloadData = domain.createEvent('downloadData');

sample({
  clock: downloadData,
  source: $patient,
  target: downloadDataFx,
});
