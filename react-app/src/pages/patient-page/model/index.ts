import { isSuccess, loading, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { createDomain, sample } from 'effector';
import { createGate } from 'effector-react';
import { Appointment, Condition, Encounter, Observation } from 'shared/src/contrib/aidbox';
import { $user, authorizedRequest } from '../../../models/auth';

const patientDomain = createDomain('patient');

interface DownloadPatientParams {
  data: { fhirUser: { id: string } };
}

interface PatientInfo {
  encounters: Array<Encounter> | [];
  observations: Array<Observation> | [];
  diagnoses: Array<Condition> | [];
  appointments: Array<Appointment> | [];
}

const downloadPatientInfoFx = patientDomain.createEffect<
  DownloadPatientParams,
  RemoteData<PatientInfo>,
  RemoteData<PatientInfo, Error>
>(
  ({
    data: {
      fhirUser: { id },
    },
  }) =>
    authorizedRequest({
      url: '/patientInfo',
      method: 'GET',
      params: {
        patientId: id,
      },
    }),
);

export const PatientProfileGate = createGate();
export const $patientInfo = patientDomain.createStore<RemoteData<PatientInfo>>(loading);
export const $encounters = $patientInfo.map(
  (encounter) => isSuccess(encounter) && encounter.data.encounters,
);
export const $observations = $patientInfo.map(
  (observation) => isSuccess(observation) && observation.data.observations,
);
export const $diagnoses = $patientInfo.map(
  (diagnose) => isSuccess(diagnose) && diagnose.data.diagnoses,
);

export const downloadApps = patientDomain.createEvent();

$patientInfo.on(downloadPatientInfoFx.doneData, (_, patientInfo) => patientInfo);

sample({
  clock: PatientProfileGate.open,
  source: $user,
  target: downloadPatientInfoFx,
});
