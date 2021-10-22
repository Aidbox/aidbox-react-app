import { createDomain, forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { createForm } from 'effector-forms';
import { env } from '../../../env';
import { authorizedRequest } from '../../../auth';
import { service } from 'aidbox-react/lib/services/service';
import { isFailure } from 'aidbox-react/lib/libs/remoteData';

const enrollmentDomain = createDomain('enrollmentDomain');

export const $enrollStatus = enrollmentDomain.createStore({});

export const FormGate = createGate();

export const form = createForm({
  fields: {
    firstName: {
      init: '',
    },
    lastName: {
      init: '',
    },
    email: {
      init: '',
    },
    orgName: {
      init: '',
    },
    password: {
      init: '',
    },
  },
});

export const submitForm = enrollmentDomain.createEvent();
export const redirectToLogin = enrollmentDomain.createEvent();

export const redirectToLoginFx = enrollmentDomain.createEffect(() => {
  const state = btoa(window.location.pathname + window.location.search);
  window.location.href = `${env.AIDBOX_URL}/auth/authorize?redirect_uri=${env.FRONTEND_URL}&response_type=code&client_id=ui-portal&state=${state}`;
});

export const createVendorFx = enrollmentDomain.createEffect(async (params) => {
  const result = await service({
    url: '/enrollVendor',
    method: 'POST',
    data: params,
  });
  if (isFailure(result)) {
    throw result;
  }
  return result;
});

$enrollStatus
  .on(createVendorFx.failData, (_, enrollStatus) => ({
    status: 'failure',
    enrollStatus,
  }))
  .reset(FormGate.close);

forward({
  from: redirectToLogin,
  to: redirectToLoginFx,
});

sample({
  source: form.$values,
  clock: submitForm,
  target: createVendorFx,
});

forward({
  from: createVendorFx.doneData,
  to: redirectToLoginFx,
});
