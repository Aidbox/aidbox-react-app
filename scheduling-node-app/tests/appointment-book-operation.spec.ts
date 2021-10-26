import { isSuccess, RemoteDataResult } from 'aidbox-react/lib/libs/remoteData';
import { getReference } from 'aidbox-react/lib/services/fhir';
import { service } from 'aidbox-react/lib/services/service';
import { withRootAccess } from 'aidbox-react/lib/utils/tests';

import { Appointment } from 'shared/src/contrib/aidbox';
import {
  createHealthcareService,
  createOrganization,
  createPatient,
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
    const patient = await createPatient();
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

    return { practitioner, practitionerRole, patient, hs1 };
  });
}

test('Appointment book operation creates an appointment with filled attrs', async () => {
  const { practitionerRole, hs1, patient } = await setup();

  const appointment = await withRootAccess(() =>
    removeRD(
      service<Appointment>({
        url: '/Appointment/$book',
        method: 'POST',
        data: {
          resourceType: 'Appointment',
          serviceType: [
            {
              coding: [{ code: 'standard' }],
            },
          ],
          participant: [
            {
              actor: getReference(practitionerRole),
              status: 'accepted',
            },
            {
              actor: getReference(patient),
              status: 'accepted',
            },
          ],
          start: '2021-10-01T10:00:00Z',
        },
      }),
    ),
  );
  expect(appointment.id).toBeDefined();
  expect(appointment.end).toBe('2021-10-01T10:45:00Z');
  expect(
    appointment.participant.find(({ actor }) => actor?.resourceType === 'HealthcareService'),
  ).toMatchObject({ actor: getReference(hs1) });
});
