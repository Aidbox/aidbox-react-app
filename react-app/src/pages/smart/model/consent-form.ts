import { createDomain, forward, guard, sample } from 'effector';
import { createGate } from 'effector-react';
import { $user, authorizedRequest } from '../../../auth';
import { env } from '../../../env';

export interface FormParams {
  scope: string | null;
  clientId: string | null;
}

export const grantDomain = createDomain('grant');
export const accessGrant = grantDomain.createEvent<FormParams>();
export const FormGate = createGate();

// ask about await
export const accessGrantFx = grantDomain.createEffect<any, any, Error>(async (data) => {
  await authorizedRequest({
    url: '/authGrant',
    method: 'POST',
    data,
  });
});

export const getGrantFx = grantDomain.createEffect<any, any, Error>(({ userId, clientId }) =>
  authorizedRequest({
    method: 'GET',
    url: `/Grant?.user.id=${userId}&.client.id=${clientId}`,
  }),
);

export const redirectToAuthorizeFx = grantDomain.createEffect<void, void, Error>(() => {
  const { search } = window.location;
  window.location.href = `${env.AIDBOX_URL}/auth/authorize/${search}`;
});

export const redirectToPortalFx = grantDomain.createEffect<void, void, Error>(() => {
  window.location.href = `${env.FRONTEND_URL}`;
});

sample({
  source: $user,
  clock: accessGrant,
  fn: (user, formParams: FormParams) => ({ userId: user.data.id, ...formParams }),
  target: accessGrantFx,
});

forward({
  from: accessGrantFx.doneData,
  to: redirectToAuthorizeFx,
});

sample({
  source: $user,
  clock: FormGate.open,
  fn: (user, clientId) => ({ userId: user.data.id, clientId }),
  target: getGrantFx,
});

guard({
  clock: getGrantFx.doneData,
  filter: (gratnResult: any) => gratnResult.data.entry.length > 0,
  target: redirectToPortalFx,
});
