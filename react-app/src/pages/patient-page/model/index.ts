import { isSuccess, loading, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { createDomain, forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { Appointment, Condition, Encounter, Observation } from 'shared/src/contrib/aidbox';
import { $user, authorizedRequest } from '../../../models/auth';

const patientDomain = createDomain('patient');

export interface App {
  description: string;
  launch_uri: string;
  logo_url: string;
  name: string;
  id: string;
}

type Apps = Array<App>;

export const downloadAppsFx = patientDomain.createEffect<
  any,
  RemoteData<Apps>,
  RemoteData<Apps, Error>
>(() =>
  authorizedRequest({
    url: '/rpc',
    method: 'POST',
    data: {
      method: 'aidbox.smart/get-smart-apps',
    },
  }),
);

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

export const SmartAppGate = createGate();
export const PatientProfileGate = createGate();
export const $apps = patientDomain.createStore<RemoteData<Apps>>(loading);
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

$apps.on(downloadAppsFx.doneData, (_, appsResult) => appsResult);

$patientInfo.on(downloadPatientInfoFx.doneData, (_, patientInfo) => patientInfo);

forward({
  from: SmartAppGate.open,
  to: downloadAppsFx,
});

sample({
  clock: PatientProfileGate.open,
  source: $user,
  target: downloadPatientInfoFx,
});
