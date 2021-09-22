import { createDomain, sample } from 'effector';
import { createForm } from 'effector-forms';
import { createGate } from 'effector-react';
import { signInFx } from '../../../models/auth';

export const FormGate = createGate();
export const loginDomain = createDomain('login');

export const submitForm = loginDomain.createEvent('submitForm');

export const form = createForm({
  fields: {
    username: {
      init: '',
    },
    password: {
      init: '',
    },
  },
});

sample({
  source: form.$values,
  clock: submitForm,
  target: signInFx,
});
