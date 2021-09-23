import * as operations from './operations';

export const manifest = {
  resources: {
    Client: {
      'ui-portal': { secret: 'secret', grant_types: ['password'] },
    },
    User: {
      portal: { password: 'password' },
    },
    Patient: { 'pt-100': { gender: 'male' } },
    AccessPolicy: {
      'allow-portal-client-all': {
        engine: 'allow',
        link: [{ id: 'ui-portal', resourceType: 'Client' }],
      },
    },
  },
  operations,
};
