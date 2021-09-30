import { createDomain, forward, sample } from 'effector';
import { service } from 'aidbox-react/lib/services/service';
import { createGate } from 'effector-react';
import { getIn } from '../../../lib/tools';
import { $user, authorizedRequest } from '../../../models/auth';

const patientDomain = createDomain('patient');

const downloadAppsFx = patientDomain.createEffect<any, any, Error>({
  handler: async () => {
    const result = await service({
      url: '/rpc',
      method: 'POST',
      data: {
        method: 'aidbox.smart/get-smart-apps',
      },
    });
    return result;
  },
});

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
