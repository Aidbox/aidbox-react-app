import { isSuccess, RemoteDataResult } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getReference } from 'aidbox-react/lib/services/fhir';
import { service } from 'aidbox-react/lib/services/service';
import { withRootAccess } from 'aidbox-react/lib/utils/tests';

import { Appointment, Bundle } from 'shared/src/contrib/aidbox';
import {
  createHealthcareService,
  createOrganization,
  createPractitioner,
  createPractitionerRole,
} from 'shared/src/utils/tests';

async function removeRD<S = any, F = any>(promise: Promise<RemoteDataResult<S, F>>) {
  const result = await promise;
  if (isSuccess(result)) {
    return result.data;
  }

  throw result.error;
}

async function setup() {
  return await withRootAccess(async () => {
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

    return { practitioner, practitionerRole };
  });
}

test('Appointment find operation returns available appointments', async () => {
  const { practitionerRole } = await setup();

  const appointments = await withRootAccess(() =>
    removeRD(
      service<Bundle<Appointment>>({
        url: '/Appointment/$find',
        params: {
          practitioner: practitionerRole.practitioner!.id!,
          'visit-type': 'standard',
          start: '2021-10-01',
          end: '2021-10-07',
        },
      }),
    )
      .then(extractBundleResources)
      .then((resourcesMap) => resourcesMap.Appointment),
  );

  expect(appointments.length).toBe(5);
});
