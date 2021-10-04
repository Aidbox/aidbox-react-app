import { sample, forward } from 'effector';
import { createForm } from 'effector-forms';
import { createGate } from 'effector-react';
import { Practitioner } from 'shared/src/contrib/aidbox';
import { authorizedRequest } from '../../../models/auth';
import { app } from '../../../models/domain';

export const admin = app.createDomain('admin');

export const FormGate = createGate();
export const PatientsGate = createGate();
export const PractitionersGate = createGate();

export const submitPatientForm = admin.createEvent();
export const submitPractitionerForm = admin.createEvent();

export const form = createForm({
  fields: {
    email: {
      init: '',
    },
    password: {
      init: '',
    },
  },
});

export const $patients = admin.createStore<any>([]);
export const $practitioners = admin.createStore<Array<Practitioner> | []>([]);

export const downloadPatientsFx = admin.createEffect<void, any, Error>(() =>
  authorizedRequest({
    url: '/Patient?_sort=.name.0.family',
    method: 'GET',
  }),
);

export const downloadPractitionersFx = admin.createEffect<void, any, Error>(() =>
  authorizedRequest({
    url: '/Practitioner?_sort=.name.0.family',
    method: 'GET',
  }),
);

export const createPatientFx = admin.createEffect<any, any, Error>((params) =>
  authorizedRequest({
    url: '/enrollPatient',
    method: 'POST',
    data: params,
  }),
);

export const createPractitionerFx = admin.createEffect<any, any, Error>((params) =>
  authorizedRequest({
    url: '/enrollPractitioner',
    method: 'POST',
    data: params,
  }),
);

$patients.on(downloadPatientsFx.doneData, (_, { data: { entry } }) => {
  return entry;
});

$practitioners.on(downloadPractitionersFx.doneData, (_, { data: { entry } }) => {
  return entry.map(({ resource }: { resource: Practitioner }) => resource);
});

sample({
  source: form.$values,
  clock: submitPatientForm,
  fn: (formData, patientId) => ({ ...formData, patientId }),
  target: createPatientFx,
});

sample({
  source: form.$values,
  clock: submitPractitionerForm,
  fn: (formData, practitionerId) => ({ ...formData, practitionerId }),
  target: createPractitionerFx,
});

// Big nested level, stack overflow
forward({
  from: PatientsGate.open,
  to: downloadPatientsFx,
});

forward({
  from: PractitionersGate.open,
  to: downloadPractitionersFx,
});

forward({
  from: [createPatientFx.doneData, FormGate.close],
  to: form.reset,
});
