import { TCtx } from '@aidbox/node-server-sdk';

import { TOperation } from '../helpers';
import { sendMail } from '../lib/maligun';

export const enrollPatient: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['enrollPatient'],
  handlerFn: async ({ resource }: any, { ctx }: { ctx: TCtx }) => {
    const { email, password } = resource;
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

    sendMail({
      from: 'PlanAPI Team <mailgun@planapi.aidbox.io>',
      to: email,
      subject: 'Portal Enrollment',
      html: `<html><p>Hello.</p> <p>You now can login to Patient Portal with the following creds: email: <b>${email}</b>, password: <b>${password}</b></p></html>`,
    });

    return { resource: { patient, user, role } };
  },
};
