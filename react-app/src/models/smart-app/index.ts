import { loading, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { createDomain, forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { getIn } from '../../lib/tools';
import { $user, authorizedRequest } from '../auth';
import { env } from '../../env';

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

export interface LaunchData {
  user: { id: string; resourceType: string };
  patient: { id: string; resourceType: string };
  client: { id: string; resourceType: string };
}

export interface LaunchResponse {
  result: {
    iss: string;
    launch: string;
    'launch-uri': string;
    uri: string;
  };
}

export const getLaunchParamFx = smartAppDomain.createEffect<
  LaunchData,
  LaunchResponse,
  RemoteData<any, Error>
>(async (data) => {
  const response = await authorizedRequest({
    url: '/rpc',
    method: 'POST',
    data: {
      method: 'aidbox.smart/get-launch-uri',
      params: {
        user: data.user,
        client: data.client,
        ctx: { patient: data.patient.id },
        iss: env.PATIENT_SMART_BASE_URL,
      },
    },
  });

  return response.data;
});

export const redirectToAuthorizeFx = smartAppDomain.createEffect<LaunchResponse, void, Error>(
  (data) => {
    window.location.href = data.result.uri;
  },
);

// check type any
export const getLaunchParam = smartAppDomain.createEvent<any>();

$smartApps.on(downloadAppsFx.doneData, (_, appsResult) =>
  mapSuccess(appsResult, (data) => getIn(data, ['result', 'smart-apps'], [])),
);

forward({
  from: SmartAppGate.open,
  to: downloadAppsFx,
});

sample({
  clock: getLaunchParam,
  source: $user,
  fn: (user, data) => {
    return {
      user: { id: user.data.id, resourceType: 'User' },
      patient: { id: data.patient.id, resourceType: 'Patient' },
      client: { id: data.client.id, resourceType: 'Client' },
    };
  },
  target: getLaunchParamFx,
});

forward({
  from: getLaunchParamFx.doneData,
  to: redirectToAuthorizeFx,
});
