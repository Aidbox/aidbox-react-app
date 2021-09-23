import { TCtx } from '@aidbox/node-server-sdk';

import { TOperation } from '../helpers';

export const enrollPatient: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['enrollPatient'],
  handlerFn: async ({ resource }: any, { ctx }: { ctx: TCtx }) => {
    const { email } = resource;
    console.log(resource);
    const patient = await ctx.api.createResource('Patient', {
      telecom: [{ system: 'email', value: email }],
    });
    const user: any = await ctx.api.createResource('User', resource);
    const role = await ctx.api.createResource('Role', {
      name: 'patient',
      user: {
        id: user.id,
        resourceType: 'User',
      },
    });

    return { resource: { patient, user, role } };
  },
};
