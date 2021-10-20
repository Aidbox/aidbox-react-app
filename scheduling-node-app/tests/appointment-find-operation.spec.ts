import { isSuccess, RemoteDataResult } from 'aidbox-react/lib/libs/remoteData';
import { service } from 'aidbox-react/lib/services/service';
import { Token } from 'aidbox-react/lib/services/token';
import { ensure, login, withRootAccess } from 'aidbox-react/lib/utils/tests';
import { extractBundleResources, getReference } from 'aidbox-react/src/services/fhir';

import { Appointment, Bundle, User } from 'shared/src/contrib/aidbox';
import { UserRole } from 'shared/src/services/role';
import {
  createHealthcareService,
  createOrganization,
  createPractitioner,
  createPractitionerRole,
  createUser,
} from 'shared/src/utils/tests';

const loginService = (user: User) => {
  return service<Token>({
    url: '/auth/token',
    method: 'POST',
    data: {
      username: user.email,
      password: user.password,
      client_id: 'SPA',
      client_secret: '123456',
      grant_type: 'password',
    },
  });
};

async function removeRD<S = any, F = any>(promise: Promise<RemoteDataResult<S, F>>) {
  const result = await promise;
  if (isSuccess(result)) {
    return result.data;
  }

  throw result.error;
}

async function setup() {
  const result = await withRootAccess(async () => {
    const organization = await createOrganization();
    const hs1 = await createHealthcareService({
      merge: { providedBy: getReference(organization) },
    });
    const practitioner = await createPractitioner();

    const practitionerRole = await createPractitionerRole({
      merge: {
        organization: getReference(organization),
        practitioner: getReference(practitioner),
        healthcareService: [getReference(hs1)],
        availableTime: [
          { daysOfWeek: ['mon'], availableStartTime: '08:00:00', availableEndTime: '12:00:00' },
        ],
      },
    });
    const user = await createUser(UserRole.Practitioner, practitioner);

    return { practitioner, practitionerRole, user };
  });

  await login(result.user, loginService);

  return result;
}

test('Appointment find operation returns available appointments', async () => {
  const { practitionerRole } = await setup();

  const appointments = await removeRD(
    service<Bundle<Appointment>>({
      url: '/Appontment/$find',
      params: {
        actor: practitionerRole.id!,
        'visit-type': 'standard',
        start: '2021-10-01',
        end: '2021-10-07',
      },
    }),
  )
    .then(extractBundleResources)
    .then((resourcesMap) => resourcesMap.Appointment);

  expect(appointments.length).toBe(5);
});
