import { createDomain, forward } from 'effector';
import { service } from 'aidbox-react/lib/services/service';
import { createGate } from 'effector-react';
import { getIn } from '../../../lib/tools';

const smartAppsDomain = createDomain('smart-apps');

const downloadAppsFx = smartAppsDomain.createEffect<any, any, Error>({
  handler: async () => {
    const result = await service({
      url: '/rpc',
      method: 'POST',
      data: {
        method: 'aidbox.smart/get-smart-apps',
      },
    });
    return result;
  },
});

export const Gate = createGate();
export const $apps = smartAppsDomain.createStore<any>(null);

export const downloadApps = smartAppsDomain.createEvent();

$apps.on(downloadAppsFx.doneData, (_, payload) => getIn(payload, ['data', 'result', 'smart-apps'], []));

forward({
  from: Gate.open,
  to: downloadAppsFx,
});
