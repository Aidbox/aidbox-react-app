import { createDomain, forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { $user, authorizedRequest, getUserDataFx } from '../../../auth';
import { accessGrantFx } from '../../smart/model/consent-form';
import { getIn } from '../../../lib/tools';
import { createForm } from 'effector-forms';
import { env } from '../../../env';

const smartAppDomain = createDomain('smartAppDomain');

export const $smartApps = smartAppDomain.createStore({ status: 'loading' });
export const $smartApp = smartAppDomain.createStore({ status: 'loading' });
export const $updateStatus = smartAppDomain.createStore({ status: '' });
export const $dataInitialized = smartAppDomain.createStore(false);
export const $grantExists = smartAppDomain.createStore(false);

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
export const createApp = smartAppDomain.createEvent();
export const removeApp = smartAppDomain.createEvent();
export const openModal = smartAppDomain.createEvent();
export const closeModal = smartAppDomain.createEvent();
export const initializeData = smartAppDomain.createEvent();

export const createAppFx = smartAppDomain.createEffect((id) =>
  authorizedRequest({ url: '/createApp', method: 'POST', data: { id } }),
);

export const openModalFx = smartAppDomain.createEffect((id) => {
  const modal = document.getElementById(id);
  modal.style.display = 'block';
});

export const closeModalFx = smartAppDomain.createEffect((id) => {
  const modal = document.getElementById(id);
  modal.style.display = 'none';
});

export const setFormFx = smartAppDomain.createEffect(({ data }) => {
  const oauthType = getIn(data, ['auth', 'authorization_code', 'pkce']) ? 'pkce' : 'secret';
  form.fields.id.onChange(data.id);
  form.fields.secret.onChange(data.secret);
  form.fields.appName.onChange(getIn(data, ['smart', 'name'], ''));
  form.fields.oauthType.onChange(oauthType);
  form.fields.redirectUri.onChange(getIn(data, ['auth', 'authorization_code', 'redirect_uri'], ''));
  form.fields.launchUri.onChange(getIn(data, ['smart', 'launch_uri'], ''));
  form.fields.logoUrl.onChange(getIn(data, ['smart', 'logo_url'], ''));
  form.fields.orgName.onChange(getIn(data, ['smart', 'organization', 'name'], ''));
  form.fields.orgUrl.onChange(getIn(data, ['smart', 'organization', 'url'], ''));
  form.fields.privacyUrl.onChange(getIn(data, ['smart', 'privacy_url'], ''));
  form.fields.tosUrl.onChange(getIn(data, ['smart', 'tos_url'], ''));
  form.fields.desc.onChange(getIn(data, ['smart', 'description'], ''));
});

export const downloadAppsFx = smartAppDomain.createEffect((id) =>
  authorizedRequest({
    url: `/Client?.smart.vendor.id=${id}`,
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

  closeModalFx(data.client.id);

  return response.data;
});

export const updateAppFx = smartAppDomain.createEffect((params) =>
  authorizedRequest({
    url: '/updateApp',
    method: 'POST',
    data: params,
  }),
);

export const removeAppFx = smartAppDomain.createEffect((id) =>
  authorizedRequest({
    url: '/removeApp',
    method: 'DELETE',
    data: { id },
  }),
);

export const initializeDataFx = smartAppDomain.createEffect((id) =>
  authorizedRequest({
    url: '/initializeData',
    method: 'POST',
    data: { id },
  }),
);

export const redirectToAppFx = smartAppDomain.createEffect(({ data }) => {
  window.location.href = `/smart-apps/${data.id}`;
});

export const redirectToAuthorizeFx = smartAppDomain.createEffect((data) => {
  window.open(data.result.uri, '_blank');
});

// check type any
export const getLaunchParam = smartAppDomain.createEvent();

export const revokeGrant = smartAppDomain.createEvent();

export const revokeGrantFx = smartAppDomain.createEffect((params) =>
  authorizedRequest({
    method: 'DELETE',
    url: '/revokeGrant',
    params,
  }),
);

export const getGrantFx = smartAppDomain.createEffect(({ userId, clientId }) =>
  authorizedRequest({
    method: 'GET',
    url: `/Grant?.user.id=${userId}&.client.id=${clientId}`,
  }),
);

$smartApps
  .on(downloadAppsFx.doneData, (_, appsResult) => ({
    status: 'success',
    data: appsResult.data.entry.map(
      ({
        resource: {
          id,
          secret,
          smart: { name, launch_uri, logo_url },
        },
      }) => ({ id, secret, name, launch_uri, logo_url }),
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

$dataInitialized.on(
  getUserDataFx.doneData,
  (_, userResult) =>
    userResult.data.role.filter((item) => item.name === 'patient' || item.name === 'practitioner')
      .length !== 0,
);

$grantExists.on(getGrantFx.doneData, (_, result) => result.data.entry.length !== 0);

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

forward({
  from: createApp,
  to: createAppFx,
});

forward({
  from: createAppFx.doneData,
  to: redirectToAppFx,
});

forward({
  from: removeApp,
  to: removeAppFx,
});

sample({
  source: $user,
  clock: removeAppFx.doneData,
  fn: (user, _) => user.data.id,
  target: downloadAppsFx,
});

forward({
  from: openModal,
  to: openModalFx,
});

forward({
  from: closeModal,
  to: closeModalFx,
});

forward({
  from: initializeData,
  to: initializeDataFx,
});

forward({
  from: initializeDataFx.doneData,
  to: getUserDataFx,
});

sample({
  clock: openModal,
  source: $user,
  fn: (user, clientId) => ({ userId: user.data.id, clientId }),
  target: getGrantFx,
});

sample({
  clock: revokeGrantFx.doneData,
  source: $user,
  fn: (user, { data }) => ({ userId: user.data.id, clientId: data.client.id }),
  target: getGrantFx,
});

sample({
  clock: revokeGrant,
  source: $user,
  fn: (user, id) => ({ clientId: id, userId: user.data.id }),
  target: revokeGrantFx,
});
