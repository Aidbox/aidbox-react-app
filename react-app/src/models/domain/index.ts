import { createDomain, sample } from 'effector';
import { useStore } from 'effector-react';

export const app = createDomain('app');
const $info = app.createStore({});

app.onCreateEffect((effect) => {
  sample({
    clock: effect.pending,
    source: $info,
    fn: (s) => ({ ...s, [effect.shortName]: { pending: true } }),
    target: $info,
  });
  sample({
    clock: effect.failData,
    source: $info,
    fn: (s, error: any) => ({ ...s, [effect.shortName]: { fail: true, error: error.message } }),
    target: $info,
  });
  sample({
    clock: effect.doneData,
    source: $info,
    fn: (s) => ({ ...s, [effect.shortName]: { success: true } }),
    target: $info,
  });
});

export const getStatus = (event: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const infoStore: any = useStore($info);
  return infoStore[event.shortName] || {};
};
