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

export const getLaunchParamFx = smartAppDomain.createEffect<any, any, RemoteData<any, Error>>(
  async (data) => {
    const response = await authorizedRequest({
      url: '/rpc',
      method: 'POST',
      data: {
        method: 'aidbox.smart/get-launch-uri',
        params: {
          user: { id: '0000016c-6b59-d6fd-0000-000000001162' },
          client: {
            id: '922e34e3-dad0-40ea-be5c-eac0f891e435',
            smart: { launch_uri: 'http://localhost:9000/launch.html' },
          },
          iss: 'http://localhost:8888/smart',
        },
      },
    });

    return response.data;
  },
);

export const redirectToAuthorizeFx = smartAppDomain.createEffect<any, any, Error>((data) => {
  // const link = `${data.launch_uri}${data.response}`;
  console.log(data.result.uri, 'data.uri');
  window.location.href = data.result.uri;
});

export const getLaunchParam = smartAppDomain.createEvent<any>();

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
