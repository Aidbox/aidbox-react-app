import { createDomain, forward, sample } from 'effector';
import { $user, authorizedRequest } from '../../../models/auth';
import { env } from '../../../env';

export const grantDomain = createDomain('grant');
export const accessGrant = grantDomain.createEvent();

// ask about await
export const accessGrantFx = grantDomain.createEffect<any, any, Error>(async (data) => {
  await authorizedRequest({
    url: '/authGrant',
    method: 'POST',
    data,
  });
});

export const redirectToAuthorizeFx = grantDomain.createEffect<any, any, Error>((data) => {
  const { search } = window.location;
  window.location.href = `${env.AIDBOX_URL}/auth/authorize/${search}`;
});

sample({
  source: $user,
  clock: accessGrant,
  fn: (user: any, formParams: any) => ({ userId: user.data.id, ...formParams }),
  target: accessGrantFx,
});

forward({
  from: accessGrantFx.doneData,
  to: redirectToAuthorizeFx,
});
