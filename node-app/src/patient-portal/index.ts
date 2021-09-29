import * as operations from './operations';

export const manifest = {
  resources: {
    Client: {
      'ui-portal': { secret: 'secret', grant_types: ['password'] },
    },
    Role: {
      admin: {
        name: 'admin',
        user: {
          id: 'portal-admin',
          resourceType: 'User',
        },
      },
      patient: {
        name: 'patient',
        user: {
          id: 'portal',
          resourceType: 'User',
        },
      },
    },
    User: {
      'portal-admin': { password: 'password' },
      portal: { password: 'password' },
    },
    Patient: { 'pt-100': { gender: 'male' } },
    AccessPolicy: {
      'allow-portal-client-all': {
        engine: 'allow',
        link: [{ id: 'ui-portal', resourceType: 'Client' }],
      },
      'allow-single-patient-smart-on-fhir': {
        engine: 'matcho',
        matcho: {
          uri: '#/smart/.*',
        },
      },
    },
  },
  operations,
  entities: {
    Patient: {
      attrs: {
        isEnrolled: {
          type: 'boolean',
        },
      },
    },
    AidboxConfig: {
      attrs: {
        auth: {
          attrs: {
            'grant-page-url': {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
