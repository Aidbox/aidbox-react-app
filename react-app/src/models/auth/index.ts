import { createDomain, guard } from 'effector';
import { service } from 'aidbox-react/lib/services/service';
import { setInstanceBaseURL, setInstanceToken } from 'aidbox-react/lib/services/instance';
import { persist } from 'effector-storage/local';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';

setInstanceBaseURL('http://localhost:8888');
export const authDomain = createDomain('auth');

authDomain.onCreateStore((store) => store.reset(resetSession));
export const resetSession = authDomain.createEvent();
export const startAuth = authDomain.createEvent();
export const startLoading = authDomain.createEvent();
export const resetToken = authDomain.createEvent();

export const $user = authDomain.createStore<any>({ status: 'loading', data: { id: '' } });
export const $token = authDomain.createStore<any>(null);

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
    const result = await service({
      method: 'GET',
      url: '/auth/userinfo',
    });
    return result;
  },
});

export const setTokenFx = authDomain.createEffect({
  handler: ({ data }: any) => {
    setInstanceToken(data);
    return data;
  },
});

$token.on(setTokenFx.doneData, (_, token) => token);
persist({ store: $token });

$user.on(getUserDataFx.doneData, (_, result) => {
  if (isSuccess(result)) {
    return { status: 'done', data: result.data };
  }
  return { status: 'error', data: null };
});

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
