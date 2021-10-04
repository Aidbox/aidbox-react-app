import { forward } from 'effector';
import { createGate } from 'effector-react';
import { Patient } from 'shared/src/contrib/aidbox';
import { authorizedRequest } from '../../../models/auth';
import { app } from '../../../models/domain';

export const practitionerDomain = app.createDomain('practitioner');

export const PatientsGate = createGate();

export const $patients = practitionerDomain.createStore<Array<Patient> | []>([]);
export const $currentPatient = practitionerDomain.createStore<Patient | {}>({});

export const downloadPatientsFx = practitionerDomain.createEffect<void, any, Error>(() =>
  authorizedRequest({
    url: '/Patient?_sort=.name.0.family',
    method: 'GET',
  }),
);

export const setCurrentPatientFx = practitionerDomain.createEffect<Patient, any, Error>(
  (patient) => patient,
);

$patients.on(downloadPatientsFx.doneData, (_, { data: { entry } }) => {
  return entry.map(({ resource }: { resource: Patient }) => resource);
});

$currentPatient.on(setCurrentPatientFx.doneData, (_, patient) => patient);

forward({
  from: PatientsGate.open,
  to: downloadPatientsFx,
});
