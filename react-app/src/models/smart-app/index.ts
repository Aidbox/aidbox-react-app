import { loading, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { createDomain, forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { getIn } from '../../lib/tools';
import { authorizedRequest } from '../auth';

const smartAppDomain = createDomain('smartAppDomain');

export const $smartApps = smartAppDomain.createStore<RemoteData<SmartApps>>(loading);

export const SmartAppGate = createGate();

export interface SmartApp {
  description: string;
  launch_uri: string;
  logo_url: string;
  name: string;
  id: string;
}

type SmartApps = Array<SmartApp>;

export const downloadAppsFx = smartAppDomain.createEffect<
  any,
  RemoteData<SmartApps>,
  RemoteData<SmartApps, Error>
>(() =>
  authorizedRequest({
    url: '/rpc',
    method: 'POST',
    data: {
      method: 'aidbox.smart/get-smart-apps',
    },
  }),
);

export const getLaunchParamFx = smartAppDomain.createEffect<string, any, RemoteData<any, Error>>(
  async (launch_uri) => {
    const response = await authorizedRequest({
      url: '/rpc',
      method: 'POST',
      data: {
        method: 'aidbox.smart/get-smart-apps',
      },
    });
    return { launch_uri, response };
  },
);

export const redirectToAuthorizeFx = smartAppDomain.createEffect<any, any, Error>((data) => {
  const link = `${data.launch_uri}${data.response}`;
  window.location.href = link;
});

export const getLaunchParam = smartAppDomain.createEvent<string>();

$smartApps.on(downloadAppsFx.doneData, (_, appsResult) =>
  mapSuccess(appsResult, (data) => getIn(data, ['result', 'smart-apps'], [])),
);

forward({
  from: SmartAppGate.open,
  to: downloadAppsFx,
});

forward({
  from: getLaunchParam,
  to: getLaunchParamFx,
});

forward({
  from: getLaunchParamFx.doneData,
  to: redirectToAuthorizeFx,
});
