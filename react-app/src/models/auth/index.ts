import { createDomain, guard, attach, createEffect } from 'effector';
import { service } from 'aidbox-react/lib/services/service';
import { persist } from 'effector-storage/local';
import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

export const authDomain = createDomain('auth');

authDomain.onCreateStore((store) => store.reset(resetSession));
export const resetSession = authDomain.createEvent();
export const startAuth = authDomain.createEvent();
export const startLoading = authDomain.createEvent();
export const resetToken = authDomain.createEvent();

export const $user = authDomain.createStore<any>({ status: 'loading', data: { id: '' } });
export const $token = authDomain.createStore<any>(null);

setInstanceBaseURL('http://localhost:8888');
type EffectParams = { token: string; params: { headers: Object } };
const backendRequest = createEffect(async ({ token, params = { headers: {} } }: EffectParams) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...params.headers,
  };
  const result = await service({ ...params, headers });
  return result;
});

export const authorizedRequest = attach({
  effect: backendRequest,
  source: $token,
  mapParams: (params: any, token) => ({ params, token }),
});

export const signInFx = authDomain.createEffect<any, any, Error>({
  handler: async (params) => {
    const result = await service({
      url: '/auth/token',
      method: 'POST',
      data: { ...params, grant_type: 'password', client_id: 'ui-portal', clientSecret: 'secret' },
    });
    return result;
  },
});

export const getUserDataFx = authDomain.createEffect({
  handler: async () => {
    const result = await authorizedRequest({
      method: 'GET',
      url: '/auth/userinfo',
    });
    return result;
  },
});

export const setTokenFx = authDomain.createEffect({
  handler: ({ data: { access_token } }: any) => access_token,
});

$token.on(setTokenFx.doneData, (_, token) => token);
persist({ store: $token });

$user.on(getUserDataFx.doneData, (_, result: any) => ({ status: 'done', data: result.data }));

guard({
  source: $token,
  filter: (source) => !!source,
  target: getUserDataFx,
});

guard({
  source: signInFx.doneData,
  filter: (source) => source.data?.access_token,
  target: setTokenFx,
});
