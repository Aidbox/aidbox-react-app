import { TCtx } from '@aidbox/node-server-sdk';

import { TOperation } from '../helpers';
import { sendMail } from '../lib/maligun';

export const enrollPatient: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['enrollPatient'],
  handlerFn: async ({ resource }: any, { ctx }: { ctx: TCtx }) => {
    const { email, password, patientId } = resource;
    const patient = await ctx.api.getResource('Patient', patientId);
    const user: any = await ctx.api.createResource('User', { email, password });
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

export const patientInfo: TOperation<{ params: { type: string } }> = {
  method: 'GET',
  path: ['patientInfo'],
  handlerFn: async ({ params: { patientId } }: any, { ctx }: { ctx: TCtx }) => {
    const params = { patient: patientId };

    const { resources: observation } = await ctx.api.findResources(`Observation`, params);
    const { resources: appointments } = await ctx.api.findResources(`Appointment`, params);
    const { resources: encouters } = await ctx.api.findResources(`Encounter`, params);
    const { resources: diagnoses } = await ctx.api.findResources(`Condition`, params);

    return { resource: { observation, appointments, encouters, diagnoses } };
  },
};
