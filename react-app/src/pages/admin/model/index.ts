import { createDomain, sample, forward } from 'effector';
import { createForm } from 'effector-forms';
import { createGate } from 'effector-react';
import { authorizedRequest } from '../../../models/auth';

export const admin = createDomain('admin');

export const FormGate = createGate();
export const PatientsGate = createGate();

export const submitForm = admin.createEvent();

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
export const $patient = admin.createStore<any>(null);
export const $submitStatus = admin.createStore<any>({});

export const downloadPatientsFx = admin.createEffect<any, any, Error>(() =>
  authorizedRequest({
    url: '/Patient?_sort=.name.0.family',
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

$patients.on(downloadPatientsFx.doneData, (_, { data: { entry } }) => {
  return entry;
});
$patient.on(createPatientFx.doneData, (_, data) => data);
$submitStatus
  .on(createPatientFx.failData, () => {
    return { fail: true, message: 'Something went wrong' };
  })
  .on(createPatientFx.doneData, () => ({
    success: true,
    message: 'You have successfully created new Patient',
  }))
  .reset(FormGate.close);

sample({
  source: form.$values,
  clock: submitForm,
  fn: (formData, patientId) => ({ ...formData, patientId }),
  target: createPatientFx,
});

// Big nested level, stack overflow
forward({
  from: PatientsGate.open,
  to: downloadPatientsFx,
});

forward({
  from: createPatientFx.doneData,
  to: form.reset,
});
