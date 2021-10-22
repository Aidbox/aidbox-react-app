import { createDomain, forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { $user, authorizedRequest } from '../../../auth';
import { getIn } from '../../../lib/tools';
import { createForm } from 'effector-forms';
import { env } from '../../../env';

const enrollmentDomain = createDomain('enrollmentDomain');

export const redirectToLogin = enrollmentDomain.createEvent();
export const redirectToLoginFx = enrollmentDomain.createEffect(() => {
  const state = btoa(window.location.pathname + window.location.search);
  window.location.href = `${env.AIDBOX_URL}/auth/authorize?redirect_uri=${env.FRONTEND_URL}&response_type=code&client_id=ui-portal&state=${state}`;
});

forward({
  from: redirectToLogin,
  to: redirectToLoginFx,
});
