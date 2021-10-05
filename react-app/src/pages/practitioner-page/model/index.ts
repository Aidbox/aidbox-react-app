import { loading, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { createDomain, forward } from 'effector';
import { createGate } from 'effector-react';
import { Bundle, Patient } from 'shared/src/contrib/aidbox';
import { authorizedRequest } from '../../../models/auth';

export const practitionerDomain = createDomain('practitioner');

export const PatientsGate = createGate();
export const PatientGate = createGate();

export const $patientsResult = practitionerDomain.createStore<RemoteData<Patient[]>>(loading);
export const $currentPatientResult = practitionerDomain.createStore<RemoteData<Patient>>(loading);

export const downloadPatientsFx = practitionerDomain.createEffect<
  any,
  RemoteData<Bundle<Patient>>,
  RemoteData<Patient[], Error>
>(() =>
  authorizedRequest({
    url: '/Patient?_sort=.name.0.family',
    method: 'GET',
  }),
);

export const downloadPatientFx = practitionerDomain.createEffect<
  any,
  RemoteData<Patient>,
  RemoteData<Patient, Error>
>((id) =>
  authorizedRequest({
    url: `/Patient/${id}`,
    method: 'GET',
  }),
);

$patientsResult
  .on(downloadPatientsFx.doneData, (_, patientsResult) =>
    mapSuccess(patientsResult, (bundle) => extractBundleResources(bundle).Patient),
  )
  .on(downloadPatientsFx.failData, (_, patientsResult) => patientsResult);

$currentPatientResult
  .on(downloadPatientFx.doneData, (_, patientResult) => patientResult)
  .on(downloadPatientFx.failData, (_, patientResult) => patientResult);

forward({
  from: PatientsGate.open,
  to: downloadPatientsFx,
});

forward({
  from: PatientGate.open,
  to: downloadPatientFx,
});
