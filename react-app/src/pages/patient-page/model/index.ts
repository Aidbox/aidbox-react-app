import { forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { Appointment, Condition, Encounter, Observation } from 'shared/src/contrib/aidbox';
import { getIn } from '../../../lib/tools';
import { $user, authorizedRequest } from '../../../models/auth';
import { app } from '../../../models/domain';

const patientDomain = app.createDomain('patient');

export const downloadAppsFx = patientDomain.createEffect<void, any, Error>(() =>
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

const downloadPatientInfoFx = patientDomain.createEffect<DownloadPatientParams, any, Error>(
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

export interface App {
  description: string;
  launch_uri: string;
  logo_url: string;
  name: string;
  id: string;
}

type Apps = Array<App>;

interface PatientInfo {
  encounters: Array<Encounter> | [];
  observations: Array<Observation> | [];
  diagnoses: Array<Condition> | [];
  appointments: Array<Appointment> | [];
}

export const SmartAppGate = createGate();
export const PatientProfileGate = createGate();
export const $apps = patientDomain.createStore<Apps | []>([]);
export const $patientInfo = patientDomain.createStore<PatientInfo>({
  encounters: [],
  observations: [],
  diagnoses: [],
  appointments: [],
});
export const $encounters = $patientInfo.map(({ encounters }) => encounters);
export const $observations = $patientInfo.map(({ observations }) => observations);
export const $diagnoses = $patientInfo.map(({ diagnoses }) => diagnoses);

export const downloadApps = patientDomain.createEvent();

$apps.on(downloadAppsFx.doneData, (_, payload) =>
  getIn(payload, ['data', 'result', 'smart-apps'], []),
);

$patientInfo.on(downloadPatientInfoFx.doneData, (_, { data }) => data);

forward({
  from: SmartAppGate.open,
  to: downloadAppsFx,
});

sample({
  clock: PatientProfileGate.open,
  source: $user,
  target: downloadPatientInfoFx,
});
