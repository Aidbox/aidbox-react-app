import { TCtx, TPatientResource } from '@aidbox/node-server-sdk';
import { TOperation } from './helpers';

export const testApi: TOperation<{ params: { type: string } }> = {
  method: 'GET',
  path: ['testApi'],
  handlerFn: async (_: any, { ctx }: { ctx: TCtx }) => {
    const { resources: patients } = await ctx.api.findResources<TPatientResource>('Patient');

    const patient = !patients.length ? null : await ctx.api.getResource<TPatientResource>('Patient', patients[0].id);

    return { resource: { patients, patient } };
  },
};
