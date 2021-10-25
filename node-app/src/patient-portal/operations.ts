import { TCtx } from '@aidbox/node-server-sdk';
import { v4 as uuid } from 'uuid';

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

export const enrollVendor: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['enrollVendor'],
  handlerFn: async ({ resource }: any, { ctx }: { ctx: TCtx }) => {
    const { firstName, lastName, email, password, orgName } = resource;

    const user: any = await ctx.api.createResource('User', {
      email,
      password,
      name: {
        givenName: firstName,
        familyName: lastName,
      },
    });

    const role = await ctx.api.createResource('Role', {
      name: 'vendor',
      user: {
        id: user.id,
        resourceType: 'User',
      },
    });

    sendMail({
      from: 'PlanAPI Team <mailgun@planapi.aidbox.io>',
      to: email,
      subject: 'Sandbox Enrollment',
      html: `<html><p>Hello.</p> <p>You now can login to Sandbox with the following creds: email: <b>${email}</b>, password: <b>${password}</b></p></html>`,
    });

    return { resource: { user, role } };
  },
};

export const createApp: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['createApp'],
  handlerFn: async (request: any, { ctx }: { ctx: TCtx }) => {
    const data = {
      trusted: true,
      type: 'smart',
      grant_types: ['authorization_code', 'basic'],
      resourceType: 'Client',
      auth: {
        authorization_code: {
          redirect_uri: 'https://my.app',
          refresh_token: true,
          secret_required: true,
          access_token_expiration: 300,
        },
      },
      secret: uuid(),
      smart: {
        name: 'New Smart App',
        launch_uri: 'https://my.app/launch',
        description: 'My New Smart App',
        vendor: { id: request.resource.id, resourceType: 'User' },
      },
    };

    const app: any = await ctx.api.createResource('Client', data);

    return { resource: app };
  },
};

export const updateApp: TOperation<{ params: { type: string } }> = {
  method: 'POST',
  path: ['updateApp'],
  handlerFn: async ({ resource }: any, { ctx }: { ctx: TCtx }) => {
    const {
      id,
      appName,
      redirectUri,
      launchUri,
      logoUrl,
      orgName,
      privacyUrl,
      orgUrl,
      tosUrl,
      desc,
      oauthType,
    } = resource;

    const pkce = oauthType === 'pkce';
    const oauthTypeMap = pkce ? { pkce: true } : { secret_required: true };

    const data = {
      auth: {
        authorization_code: {
          redirect_uri: redirectUri,
          ...oauthTypeMap,
        },
      },
      smart: {
        name: appName,
        launch_uri: launchUri,
        description: desc,
        logo_url: logoUrl,
        organization: { name: orgName, url: orgUrl },
        tos_url: tosUrl,
        privacy_url: privacyUrl,
      },
    };

    const app: any = await ctx.api.patchResource('Client', id, data);

    return { resource: app };
  },
};

export const removeApp: TOperation<{ params: { type: string } }> = {
  method: 'DELETE',
  path: ['removeApp'],
  handlerFn: async (request: any, { ctx }: { ctx: TCtx }) => {
    const { data: resource, request: rq } = await ctx.client.request({
      url: `/Client/${request.resource.id}`,
      method: 'DELETE',
    });

    return { resource };
  },
};
