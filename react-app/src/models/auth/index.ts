import { createDomain, guard } from 'effector';

import { box } from '../../lib/box';
import { env } from '../../env';

export const authDomain = createDomain('auth');

export const authorize = authDomain.createEffect({
  async handler() {
    const result = await box.authorize({
      username: env.ADMIN_ID,
      password: env.ADMIN_PASSWORD,
    });
    return result;
  },
});

/* guard({ */
/*   source: $patient, */
/*   target: downloadDataFx, */
/* }); */
