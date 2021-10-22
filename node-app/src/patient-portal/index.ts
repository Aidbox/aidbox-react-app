import path from 'path';

import dotenv from 'dotenv';

import * as operations from './operations';

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
});

export const manifest = {
  resources: {
    Client: {
      'ui-portal': {
        secret: 'secret',
        grant_types: ['code'],
        first_party: true,
        auth: {
          authorization_code: {
            redirect_uri: process.env.FRONTEND_URL,
            access_token_expiration: 360,
          },
        },
      },
      'growth-chart': {
        trusted: true,
        type: 'smart',
        grant_types: ['authorization_code', 'basic'],
        resourceType: 'Client',
        auth: {
          authorization_code: {
            redirect_uri: 'https://cmpl-growth-chart.aidbox.app/',
            refresh_token: true,
            secret_required: true,
            access_token_expiration: 300,
          },
        },
        secret: 'growth-chart',
        smart: {
          name: 'Growth Chart',
          launch_uri: 'https://cmpl-growth-chart.aidbox.app/launch.html',
          description:
            'The Growth Chart app was developed from a unique collaboration among SMART, Fjord service design consultancy, Interopion software development group, and clinicians. This App demonstrates a high-performance, concise, minimal-click presentation of a child’s growth over time.',
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
      superadmin: {
        name: 'superadmin',
        user: {
          id: 'admin',
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
      'allow-public-operations': {
        engine: 'allow',
        link: [{ id: 'enrollVendor', resourceType: 'Operation' }],
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
