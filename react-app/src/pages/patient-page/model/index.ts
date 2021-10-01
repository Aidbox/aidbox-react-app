import { forward, sample } from 'effector';
import { createGate } from 'effector-react';
import { getIn } from '../../../lib/tools';
import { $user, authorizedRequest } from '../../../models/auth';
import { app } from '../../../models/domain';

const patientDomain = app.createDomain('patient');

export const downloadAppsFx = patientDomain.createEffect<any, any, Error>(() =>
  authorizedRequest({
    url: '/rpc',
    method: 'POST',
    data: {
      method: 'aidbox.smart/get-smart-apps',
    },
  }),
);

const downloadPatientInfoFx = patientDomain.createEffect<any, any, Error>(
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
export const $apps = patientDomain.createStore<any>(null);
export const $patientInfo = patientDomain.createStore<any>({});
export const $encounters = $patientInfo.map(({ encouters }) => encouters);
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
