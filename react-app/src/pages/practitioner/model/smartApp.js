import { createDomain, forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { getIn } from '../../../lib/tools';
import { $user, authorizedRequest } from '../../../auth';
import { env } from '../../../env';

const smartAppDomain = createDomain('smartAppDomain');

export const $smartApps = smartAppDomain.createStore({ status: 'loading' });

export const SmartAppGate = createGate();

export const downloadAppsFx = smartAppDomain.createEffect(() =>
  authorizedRequest({
    url: '/rpc',
    method: 'POST',
    data: {
      method: 'aidbox.smart/get-smart-apps',
    },
  }),
);

export const getLaunchParamFx = smartAppDomain.createEffect(async (data) => {
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

export const redirectToAuthorizeFx = smartAppDomain.createEffect((data) => {
  window.open(data.result.uri, '_blank');
});

// check type any
export const getLaunchParam = smartAppDomain.createEvent();

$smartApps
  .on(downloadAppsFx.doneData, (_, appsResult) => ({
    status: 'success',
    data: getIn(appsResult, ['data', 'result', 'smart-apps'], []),
  }))
  .on(downloadAppsFx.failData, (_, appsResult) => ({
    status: 'failure',
    error: appsResult.message,
  }))
  .on(downloadAppsFx, () => ({
    status: 'loading',
  }));

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
