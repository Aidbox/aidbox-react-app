import { createDomain, sample } from 'effector';
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

export const createPatientFx = newPatientDomain.createEffect<any, any, Error>({
  handler: async (params) => {
    const result = await authorizedRequest({
      url: '/Patient',
      method: 'PUT',
      data: { telecom: [{ system: 'email', value: params.email }] },
    });
    return result;
  },
});

$patient.on(createPatientFx.doneData, (_, data) => data);

sample({
  source: form.$values,
  clock: submitForm,
  target: createPatientFx,
});
