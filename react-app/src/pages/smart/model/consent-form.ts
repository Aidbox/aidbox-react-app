import { createDomain, forward, sample } from 'effector';
import { $user, authorizedRequest } from '../../../auth';
import { env } from '../../../env';

export interface FormParams {
  scope: string | null;
  clientId: string | null;
}

export const grantDomain = createDomain('grant');
export const accessGrant = grantDomain.createEvent<FormParams>();

// ask about await
export const accessGrantFx = grantDomain.createEffect<any, any, Error>(async (data) => {
  await authorizedRequest({
    url: '/authGrant',
    method: 'POST',
    data,
  });
});

export const redirectToAuthorizeFx = grantDomain.createEffect<void, void, Error>(() => {
  const { search } = window.location;
  window.location.href = `${env.AIDBOX_URL}/auth/authorize/${search}`;
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
