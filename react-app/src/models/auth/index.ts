import { createDomain, sample, guard } from 'effector';

import { box } from '../../lib/box';
import { env } from '../../env';

export const authDomain = createDomain('auth');

export const authorize = authDomain.createEffect({
  name: 'authorize',
  async handler() {
    const result = await box.authorize({
      username: env.ADMIN_ID,
      password: env.ADMIN_PASSWORD,
    });
    return result;
  },
});
