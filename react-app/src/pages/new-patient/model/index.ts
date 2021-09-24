import { createDomain, sample, forward } from 'effector';
import { createForm } from 'effector-forms';
import { createGate } from 'effector-react';
import { authorizedRequest } from '../../../models/auth';

export const FormGate = createGate();
export const newPatientDomain = createDomain('new-patient');

export const submitForm = newPatientDomain.createEvent();

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

export const $patient = newPatientDomain.createStore<any>(null);
export const $submitStatus = newPatientDomain.createStore<any>({});

export const createPatientFx = newPatientDomain.createEffect<any, any, Error>({
  handler: async (params) => {
    const result = await authorizedRequest({
      url: '/enrollPatient',
      method: 'POST',
      data: params,
    });
    return result;
  },
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
  target: createPatientFx,
});

forward({
  from: createPatientFx.doneData,
  to: form.reset,
});
