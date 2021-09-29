import { createDomain, sample } from 'effector';
import { $user, authorizedRequest } from '../../../models/auth';

export const grantDomain = createDomain('grant');
export const accessGrant = grantDomain.createEvent();

export const accessGrantFx = grantDomain.createEffect<any, any, Error>(async (data) => {
  await authorizedRequest({
    url: '/authGrant',
    method: 'POST',
    data,
  });
  const { search } = window.location;
  window.location.href = `http://localhost:8888/auth/authorize/${search}`;
});

sample({
  source: $user,
  fn: (data: any) => data,
  clock: accessGrant,
  target: accessGrantFx,
});
