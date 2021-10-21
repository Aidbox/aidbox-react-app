import { saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { getReference } from 'aidbox-react/lib/services/fhir';
import { ensure } from 'aidbox-react/lib/utils/tests';
import * as faker from 'faker';

import {
  Address,
  ContactPoint,
  HealthcareService,
  HumanName,
  Organization,
  Patient,
  Practitioner,
  PractitionerRole,
  Location,
  Role,
  User,
  Appointment,
} from '../contrib/aidbox';
import { UserRole } from '../services/role';

export async function createHealthcareService({ merge }: { merge?: Partial<HealthcareService> }) {
  return ensure(
    await saveFHIRResource<HealthcareService>({
      name: 'Standard appointment',
      type: [
        {
          text: 'Standard Appointment',
          coding: [
            {
              code: 'standard',
              system: 'urn:appointment-type:c8h',
              display: 'Standard Appointment',
            },
          ],
        },
      ],
      duration: 45,
      resourceType: 'HealthcareService',
      active: true,
      appointmentRequired: true,
      ...(merge || {}),
    }),
  );
}

export const roleFabric: { [role: string]: () => Promise<Practitioner | Patient> } = {
  practitioner: createPractitioner,
  patient: createPatient,
};

export async function createUser(roleName: UserRole, person?: Patient | Practitioner) {
  let personUser: User;

  const thePerson = person || (await roleFabric[roleName]());
  const personEmail = faker.internet.email();
  personUser = {
    resourceType: 'User',
    data: {
      givenName: thePerson.name![0]!.given![0]!,
      familyName: thePerson.name![0]!.family!,
    },
    password: '12345678',
    phoneNumber: faker.phone.phoneNumber(),
    email: personEmail,
  };

  const user = ensure(await saveFHIRResource<User>(personUser));

  ensure(
    await saveFHIRResource<Role>({
      resourceType: 'Role',
      name: roleName as Role['name'],
      context: { main: true },
      user: getReference(user),
      links: {
        [thePerson.resourceType.toLowerCase()]: {
          id: thePerson.id,
          resourceType: thePerson.resourceType,
        },
      },
    }),
  );

  return user;
}

export async function createPractitioner(props?: { merge?: Partial<Practitioner> }) {
  const gender = randomGender();
  const practitionerResource: Practitioner = {
    resourceType: 'Practitioner',
    name: randomName(),
    gender,
    ...(props?.merge || {}),
  };

  return ensure<Practitioner>(await saveFHIRResource(practitionerResource));
}

export function randomNamePair() {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();

  return [firstName, lastName];
}

export function randomName(): HumanName[] {
  const [firstName, lastName] = randomNamePair();

  return [{ given: [firstName], family: lastName, text: `${firstName} ${lastName}` }];
}

export function randomGender() {
  if (faker.datatype.boolean()) {
    return 'male';
  } else {
    return 'female';
  }
}

export async function createPractitionerRole(props?: { merge?: Partial<PractitionerRole> }) {
  const organization = props?.merge?.organization ?? getReference(await createOrganization());
  const generatedPractitionerRole: PractitionerRole = {
    resourceType: 'PractitionerRole',
    organization,
  };

  return ensure<PractitionerRole>(
    await saveFHIRResource({ ...generatedPractitionerRole, ...(props?.merge || {}) }),
  );
}

export async function createPatient(props?: { merge?: Partial<Patient> }) {
  const gender = randomGender();
  const patient: Patient = {
    resourceType: 'Patient',
    name: randomName(),
    gender,
    ...(props?.merge || {}),
  };

  return ensure<Patient>(await saveFHIRResource(patient));
}

export async function createOrganization(props?: { merge?: Partial<Organization> }) {
  const randomOrganization: Organization = {
    resourceType: 'Organization',
    name: faker.company.companyName(),
  };

  return ensure<Organization>(
    await saveFHIRResource({ ...randomOrganization, ...(props?.merge || {}) }),
  );
}

export async function createAppointment(props?: {
  location?: Location;
  patient?: Patient;
  practitionerRole?: PractitionerRole;
  merge?: Partial<Appointment>;
}) {
  const location = props?.location ?? (await createLocation());
  const patient = props?.patient ?? (await createPatient());
  const practitionerRole = props?.practitionerRole ?? (await createPractitionerRole());

  return ensure(
    await saveFHIRResource<Appointment>({
      resourceType: 'Appointment',
      status: 'booked',
      start: '2021-10-01T10:00:00Z',
      end: '2021-10-01T10:45:00Z',
      participant: [
        { actor: getReference(patient), status: 'accepted' },
        { actor: getReference(practitionerRole), status: 'accepted' },
        { actor: getReference(location), status: 'accepted' },
      ],
      ...(props?.merge || {}),
    }),
  );
}

export function randomAddress(): Address {
  const line1 = faker.address.streetAddress();
  const line2 = faker.address.secondaryAddress();
  const city = faker.address.city();
  const state = faker.address.state();
  const postalCode = faker.address.zipCode();
  const country = faker.address.country();
  const text = `${line1}, ${line2}, ${city}, ${state}, ${city}, ${postalCode}`;

  return {
    use: 'work',
    type: 'both',
    text: text,
    line: [line1, line2],
    city: city,
    district: country,
    state: state,
    postalCode: postalCode,
    country: country,
  };
}

export async function createLocation(props?: { merge?: Partial<Location> }) {
  const managingOrganization =
    props?.merge?.managingOrganization ?? getReference(await createOrganization());

  return ensure(
    await saveFHIRResource<Location>({
      resourceType: 'Location',
      status: 'active',
      name: faker.address.streetName(),
      alias: [faker.address.streetName(), faker.address.streetName(), faker.address.streetName()],
      description: faker.lorem.sentence(),
      telecom: [randomContactPoint()],
      address: randomAddress(),
      physicalType: {
        coding: [
          {
            code: 'bu',
            system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
            display: 'Building',
          },
        ],
        text: 'Building',
      },
      position: {
        latitude: parseInt(faker.address.latitude(), 10),
        longitude: parseInt(faker.address.longitude(), 10),
      },
      managingOrganization,
      hoursOfOperation: [
        {
          daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri'],
          openingTime: '08:00:00',
          closingTime: '20:00:00',
        },
        { daysOfWeek: ['sat', 'sun'], openingTime: '10:00:00', closingTime: '18:00:00' },
      ],
      ...(props?.merge || {}),
    }),
  );
}

export function randomContactPoint(): ContactPoint {
  return {
    system: 'phone',
    value: faker.phone.phoneNumber(),
    use: 'work',
  };
}
