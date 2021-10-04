import * as operations from './operations';

export const manifest = {
  resources: {
    Client: {
      'ui-portal': {
        secret: 'secret',
        grant_types: ['code'],
        first_party: true,
        auth: {
          authorization_code: {
            redirect_uri: 'http://localhost:3000/',
            access_token_expiration: 360,
          },
        },
      },
    },
    Role: {
      admin: {
        name: 'admin',
        user: {
          id: 'portal-admin',
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
    Practitioner: {
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
