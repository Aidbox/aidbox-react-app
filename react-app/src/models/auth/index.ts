import { createDomain, guard, attach, createEffect, combine } from 'effector';
import { service } from 'aidbox-react/lib/services/service';
import { isFailure } from 'aidbox-react/lib/libs/remoteData';
import { persist } from 'effector-storage/local';
import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

export const authDomain = createDomain('auth');

export const $user = authDomain.createStore<any>({ status: 'idle', data: { id: '' } });
export const $token = authDomain.createStore<any>(null);

export const signOut = authDomain.createEvent();

setInstanceBaseURL('http://localhost:8888');
type EffectParams = { token: string; params: { headers: Object } };

const backendRequest = createEffect(async ({ token, params = { headers: {} } }: EffectParams) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...params.headers,
  };
  const result = await service({ ...params, headers });
  if (isFailure(result)) {
    throw new Error(result.error);
  }
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

// ASK Alex Streltsov
const $canLoadUser = combine($token, $user, (token, user) => {
  return token && !user.data.id;
});

$canLoadUser.watch((shouldLoad) => shouldLoad && getUserDataFx());

$token.on(setTokenFx.doneData, (_, token) => token).reset(signOut);
persist({ store: $token, key: 'token' });

$user
  .on(getUserDataFx.doneData, (_, result: any) => ({ status: 'done', data: result.data }))
  .reset(signOut);

/* guard({ */
/*   source: $canLoadUser, */
/*   filter: (source) => { */
/*     console.log(source, 'ASDFASDFSADFSADFASDF'); */
/*     return source; */
/*   }, */
/*   target: getUserDataFx, */
/* }); */

guard({
  source: signInFx.doneData,
  filter: (source) => source.data?.access_token,
  target: setTokenFx,
});
