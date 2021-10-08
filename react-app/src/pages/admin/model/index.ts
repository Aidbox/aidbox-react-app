import { loading, notAsked, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { sample, forward, createDomain } from 'effector';
import { createForm } from 'effector-forms';
import { createGate } from 'effector-react';
import { Bundle, Patient, Practitioner } from 'shared/src/contrib/aidbox';
import { authorizedRequest } from '../../../models/auth';

export const admin = createDomain('admin');

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

interface ExtendedPatient extends Patient {
  isEnrolled: string;
}

interface ExtendedPractitioner extends Practitioner {
  isEnrolled: string;
}

export const $patientsResult = admin.createStore<RemoteData<ExtendedPatient[]>>(loading);
export const $practitionersResult = admin.createStore<RemoteData<ExtendedPractitioner[]>>(loading);
export const $enrollStatus = admin.createStore<RemoteData>(notAsked);

export const downloadPatientsFx = admin.createEffect<
  any,
  RemoteData<Bundle<ExtendedPatient>>,
  RemoteData<ExtendedPatient[], Error>
>(() =>
  authorizedRequest({
    url: '/Patient?_sort=.name.0.family',
    method: 'GET',
  }),
);

export const downloadPractitionersFx = admin.createEffect<
  any,
  RemoteData<Bundle<ExtendedPractitioner>>,
  RemoteData<ExtendedPractitioner[], Error>
>(() =>
  authorizedRequest({
    url: '/Practitioner?_sort=.name.0.family',
    method: 'GET',
  }),
);

export const createPatientFx = admin.createEffect<any, RemoteData, RemoteData<Error>>((params) =>
  authorizedRequest({
    url: '/enrollPatient',
    method: 'POST',
    data: params,
  }),
);

export const createPractitionerFx = admin.createEffect<any, RemoteData, RemoteData<Error>>(
  (params) =>
    authorizedRequest({
      url: '/enrollPractitioner',
      method: 'POST',
      data: params,
    }),
);

$patientsResult
  .on(downloadPatientsFx.doneData, (_, patientsResult) =>
    mapSuccess(patientsResult, (bundle) => extractBundleResources(bundle).Patient),
  )
  .on(downloadPatientsFx.failData, (_, patientsResult) => patientsResult);

$practitionersResult
  .on(downloadPractitionersFx.doneData, (_, practitionersResult) =>
    mapSuccess(practitionersResult, (bundle) => extractBundleResources(bundle).Practitioner),
  )
  .on(downloadPractitionersFx.failData, (_, patientsResult) => patientsResult);

$enrollStatus
  .on(createPatientFx.doneData, (_, enrollStatus) => enrollStatus)
  .on(createPatientFx.failData, (_, enrollStatus) => enrollStatus)
  .on(createPractitionerFx.doneData, (_, enrollStatus) => enrollStatus)
  .on(createPractitionerFx.failData, (_, enrollStatus) => enrollStatus)
  .reset(FormGate.close);

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
