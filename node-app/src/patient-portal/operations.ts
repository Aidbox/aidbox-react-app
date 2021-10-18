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

export const enrollPractitioner: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['enrollPractitioner'],
  handlerFn: async ({ resource }: any, { ctx }: { ctx: TCtx }) => {
    const { email, password, practitionerId } = resource;
    const practitioner = await ctx.api.getResource('Practitioner', practitionerId);
    const user: any = await ctx.api.createResource('User', {
      email,
      password,
      fhirUser: {
        id: practitionerId,
        resourceType: 'Practitioner',
      },
    });

    const role = await ctx.api.createResource('Role', {
      name: 'practitioner',
      user: {
        id: user.id,
        resourceType: 'User',
      },
      links: {
        practitioner: {
          resourceType: 'Practitioner',
          id: practitionerId,
        },
      },
    });
    await ctx.api.patchResource('Practitioner', practitionerId, { isEnrolled: true });
    sendMail({
      from: 'PlanAPI Team <mailgun@planapi.aidbox.io>',
      to: email,
      subject: 'Portal Enrollment',
      html: `<html><p>Hello.</p> <p>You now can login to Patient Portal with the following creds: email: <b>${email}</b>, password: <b>${password}</b></p></html>`,
    });

    return { resource: { practitioner, user, role } };
  },
};

export const patientInfo: TOperation<{ params: { type: string } }> = {
  method: 'GET',
  path: ['patientInfo'],
  handlerFn: async (request: any, { ctx }: { ctx: TCtx }) => {
    const params = {
      patient: request.params.patientId,
    };

    const { resources: observations } = await ctx.api.findResources(`Observation`, params);
    const { resources: appointments } = await ctx.api.findResources(`Appointment`, params);
    const { resources: encounters } = await ctx.api.findResources(`Encounter`, params);
    const { resources: diagnoses } = await ctx.api.findResources(`Condition`, params);

    return { resource: { observations, encounters, diagnoses, appointments } };
  },
};

export const authGrant: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['authGrant'],
  handlerFn: async (request: any, { ctx }: { ctx: TCtx }) => {
    const user: any = await ctx.api.getResource(`User`, request.resource.userId);

    const grant = await ctx.api.createResource(`Grant`, {
      user: {
        id: user.id,
        resourceType: 'User',
      },
      client: {
        id: request.resource.clientId,
        resourceType: 'Client',
      },
      'requested-scope': request.resource.scope.split(' '),
      'provided-scope': request.resource.scope.split(' '),
      patient: user.fhirUser,
    });

    return { resource: grant };
  },
};

export const revokeGrant: TOperation<{ params: { type: string } }> = {
  method: 'DELETE',
  path: ['revokeGrant'],
  handlerFn: async (request: any, { ctx }: { ctx: TCtx }) => {
    const { data: resource, request: rq } = await ctx.client.request({
      url: '/Grant',
      method: 'DELETE',
      params: {
        '.client.id': request.params.clientId,
        '.user.id': request.params.userId,
      },
    });

    return { resource };
  },
};
