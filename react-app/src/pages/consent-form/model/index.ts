import { createDomain, sample } from 'effector';
import { $user, authorizedRequest } from '../../../models/auth';

export const grantDomain = createDomain('grant');
export const accessGrant = grantDomain.createEvent();

export const accessGrantFx = grantDomain.createEffect<any, any, Error>(
  async (data) =>
    await authorizedRequest({
      url: '/authGrant',
      method: 'POST',
      data,
    }),
);

sample({
  source: $user,
  fn: ({ data: { id } }, data: any) => ({ ...data, userId: id }),
  clock: accessGrant,
  target: accessGrantFx,
});
