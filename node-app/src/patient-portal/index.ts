import * as operations from './operations';

export const manifest = {
  entities: {
    Client: {
      attrs: {
        data: {
          isOpen: true,
        },
        smart: {
          attrs: {
            name: {
              description: 'Smart Configuration for Client',
              type: 'string',
            },
            support_email: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            short_description: {
              type: 'string',
            },
            logo_url: {
              type: 'url',
            },
            launch_url: {
              type: 'url',
            },
            tos_url: {
              type: 'url',
            },
            org_url: {
              type: 'url',
            },
            support_phone_number: {
              type: 'string',
            },
            image_url: {
              type: 'url',
            },
            policy_url: {
              type: 'url',
            },
            private_scopes_required: {
              type: 'boolean',
            },
            dev_team_contacts: {
              type: 'string',
            },
            organization: {
              attrs: {
                url: {
                  type: 'url',
                },
                name: {
                  type: 'string',
                },
              },
            },
            request: {
              attrs: {
                date: {
                  type: 'dateTime',
                },
                rejection_reason: {
                  type: 'string',
                },
                dirty: {
                  type: 'boolean',
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'approved', 'rejected'],
                },
              },
            },
            vendor: {
              attrs: {
                id: {
                  type: 'string',
                },
                resourceType: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  resources: {
    Patient: { 'pt-100': { gender: 'male' } },
  },
  operations,
};
