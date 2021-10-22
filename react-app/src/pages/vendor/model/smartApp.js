import { createDomain, forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { $user, authorizedRequest } from '../../../auth';
import { getIn } from '../../../lib/tools';
import { createForm } from 'effector-forms';
import { env } from '../../../env';
import { isFailure } from 'aidbox-react/lib/libs/remoteData';

const smartAppDomain = createDomain('smartAppDomain');

export const $smartApps = smartAppDomain.createStore({ status: 'loading' });
export const $smartApp = smartAppDomain.createStore({ status: 'loading' });
export const $updateStatus = smartAppDomain.createStore({ status: '' });

export const SmartAppGate = createGate();
export const SmartAppFormGate = createGate();

export const form = createForm({
  fields: {
    id: {
      init: '',
    },
    secret: {
      init: '',
    },
    appName: {
      init: '',
    },
    oauthType: {
      init: 'secret',
    },
    redirectUri: {
      init: '',
    },
    launchUri: {
      init: '',
    },
    logoUrl: {
      init: '',
    },
    orgName: {
      init: '',
    },
    orgUrl: {
      init: '',
    },
    privacyUrl: {
      init: '',
    },
    tosUrl: {
      init: '',
    },
    desc: {
      init: '',
    },
  },
});

export const submitForm = smartAppDomain.createEvent();

export const setFormFx = smartAppDomain.createEffect(({ data }) => {
  const oauthType = getIn(data, ['auth', 'authorization_code', 'pkce']) ? 'pkce' : 'secret';
  form.fields.id.onChange(data.id);
  form.fields.secret.onChange(data.secret);
  form.fields.appName.onChange(getIn(data, ['smart', 'name'], ''));
  form.fields.oauthType.onChange(oauthType);
  form.fields.redirectUri.onChange(getIn(data, ['auth', 'authorization_code', 'redirect_uri'], ''));
  form.fields.launchUri.onChange(getIn(data, ['smart', 'launch_uri'], ''));
  form.fields.desc.onChange(getIn(data, ['smart', 'description'], ''));
});

export const downloadAppsFx = smartAppDomain.createEffect(() =>
  authorizedRequest({
    url: '/Client?.type=smart',
    method: 'GET',
  }),
);

export const downloadAppFx = smartAppDomain.createEffect((id) =>
  authorizedRequest({
    url: `/Client/${id}`,
    method: 'GET',
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

export const updateAppFx = smartAppDomain.createEffect((params) =>
  authorizedRequest({
    url: '/updateApp',
    method: 'POST',
    data: params,
  }),
);

export const redirectToAuthorizeFx = smartAppDomain.createEffect((data) => {
  window.location.href = data.result.uri;
});

// check type any
export const getLaunchParam = smartAppDomain.createEvent();

$smartApps
  .on(downloadAppsFx.doneData, (_, appsResult) => ({
    status: 'success',
    data: appsResult.data.entry.map(
      ({
        resource: {
          id,
          secret,
          smart: { name, launch_uri },
        },
      }) => ({ id, secret, name, launch_uri }),
    ),
  }))
  .on(downloadAppsFx.failData, (_, appsResult) => ({
    status: 'failure',
    error: appsResult.message,
  }))
  .on(downloadAppsFx, () => ({
    status: 'loading',
  }));

$smartApp
  .on(downloadAppFx.doneData, (_, { data }) => ({
    status: 'success',
    data,
  }))
  .on(downloadAppsFx.failData, (_, appsResult) => ({
    status: 'failure',
    error: appsResult.message,
  }))
  .on(downloadAppsFx, () => ({
    status: 'loading',
  }));

$updateStatus
  .on(updateAppFx.doneData, (_, appsResult) => ({ status: 'success' }))
  .on(updateAppFx.failData, (_, appsResult) => ({
    status: 'failure',
    error: appsResult.error,
  }))
  .reset(SmartAppFormGate.close);

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

forward({
  from: SmartAppFormGate.open,
  to: downloadAppFx,
});

forward({
  from: downloadAppFx.doneData,
  to: setFormFx,
});

sample({
  source: form.$values,
  clock: submitForm,
  target: updateAppFx,
});
