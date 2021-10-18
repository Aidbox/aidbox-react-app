import { createDomain, guard, attach, createEffect, combine, forward, sample } from 'effector';
import { mapSuccess, service } from 'aidbox-react/lib/services/service';
import { isFailure, isSuccess, loading, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { persist } from 'effector-storage/local';
import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';
import { navigateTo, HistoryGate } from '../history';
import { env } from '../env';
import { User } from 'shared/src/contrib/aidbox';

export const authDomain = createDomain('auth');

export const $user = authDomain.createStore<any>(loading);
export const $token = authDomain.createStore<any>(null);
persist({ store: $token, key: 'token' });

export const signOut = authDomain.createEvent();
export const revokeGrant = authDomain.createEvent<string>();

setInstanceBaseURL(env.AIDBOX_URL);
type EffectParams = { token: string; params: { headers: Object } };

const backendRequest = createEffect(async ({ token, params = { headers: {} } }: EffectParams) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...params.headers,
  };
  const result = await service({ ...params, headers });
  if (isFailure(result)) {
    throw result;
  }
  return result;
});

export const authorizedRequest = attach({
  effect: backendRequest,
  source: $token,
  mapParams: (params: any, token) => ({ params, token }),
});

export const getUserDataFx = authDomain.createEffect<void, RemoteData<User>, RemoteData<Error>>(
  () =>
    authorizedRequest({
      method: 'GET',
      url: '/auth/userinfo',
    }),
);

export const signOutFx = authDomain.createEffect(() =>
  authorizedRequest({
    method: 'DELETE',
    url: '/Session',
  }),
);

export const getTokenFx = authDomain.createEffect((code: any) =>
  service({
    url: '/auth/token',
    method: 'POST',
    data: {
      grant_type: 'authorization_code',
      client_id: 'ui-portal',
      code: code,
    },
  }),
);

export const revokeGrantFx = authDomain.createEffect((params: any) =>
  authorizedRequest({
    method: 'DELETE',
    url: '/revokeGrant',
    params,
  }),
);

export const setTokenFx = authDomain.createEffect((token: any) => token);

const $canLoadUser = combine($token, $user, (token, userData) => {
  return token && !isSuccess(userData);
});

$canLoadUser.watch((shouldLoad) => shouldLoad && getUserDataFx());

$token.on(setTokenFx.doneData, (_, token) => token).reset(signOutFx.doneData);

$user
  .on(getUserDataFx.doneData, (_, result) => mapSuccess(result, (data) => data))
  .reset(signOutFx.doneData);

forward({
  from: signOut,
  to: signOutFx,
});

sample({
  clock: revokeGrant,
  source: $user,
  fn: (user, id) => ({ clientId: id, userId: user.data.id }),
  target: revokeGrantFx,
});

sample({
  source: guard({
    source: HistoryGate.state,
    filter: (routeParams) => {
      const params = new URLSearchParams(routeParams?.location?.search);
      return !!params.get('code');
    },
  }),
  fn: (routeParams) => {
    const params = new URLSearchParams(routeParams?.location?.search);
    return params.get('code');
  },
  target: getTokenFx,
});

sample({
  clock: getTokenFx.doneData,
  fn: ({ data: { access_token } }: any) => access_token,
  target: setTokenFx,
});

sample({
  source: HistoryGate.state,
  clock: setTokenFx.doneData,
  fn: (routeParams): any => {
    const params = new URLSearchParams(routeParams?.location?.search);
    const state: any = params.get('state');
    return atob(state);
  },
  target: navigateTo,
});
