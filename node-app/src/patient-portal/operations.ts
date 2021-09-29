import { TCtx } from '@aidbox/node-server-sdk';

import { TOperation } from '../helpers';
import { sendMail } from '../lib/maligun';

export const enrollPatient: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['enrollPatient'],
  handlerFn: async ({ resource }: any, { ctx }: { ctx: TCtx }) => {
    const { email, password, patientId } = resource;
    const patient = await ctx.api.getResource('Patient', patientId);
    const user: any = await ctx.api.createResource('User', {
      email,
      password,
      fhirUser: {
        id: patientId,
        resourceType: 'Patient',
      },
    });

    const role = await ctx.api.createResource('Role', {
      name: 'patient',
      user: {
        id: user.id,
        resourceType: 'User',
      },
      links: {
        patient: {
          resourceType: 'Patient',
          id: patientId,
        },
      },
    });

    await ctx.api.patchResource('Patient', patientId, { isEnrolled: true });

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

    const { resources: observations } = await ctx.api.findResources(`Observation`, params);
    const { resources: appointments } = await ctx.api.findResources(`Appointment`, params);
    const { resources: encouters } = await ctx.api.findResources(`Encounter`, params);
    const { resources: diagnoses } = await ctx.api.findResources(`Condition`, params);

    return { resource: { observations, appointments, encouters, diagnoses } };
  },
};

export const authGrant: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['authGrant'],
  handlerFn: async (requst: any, { ctx }: { ctx: TCtx }) => {
    console.log(ctx);
    const grant = await ctx.api.createResource(`Grant`, {
      user: {
        id: requst['oauth/user'].id,
        resourceType: 'User',
      },
      client: {
        id: requst.resource.clientId,
        resourceType: 'Client',
      },
      'requested-scope': requst.resource.scope.split(' '),
      'provided-scope': requst.resource.scope.split(' '),
      patient: requst['oauth/user'].fhirUser,
    });

    return { resource: grant };
  },
};
