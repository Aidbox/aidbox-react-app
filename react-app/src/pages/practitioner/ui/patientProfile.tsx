import { useGate, useStore } from 'effector-react';
import * as practitionerModel from '../model/practitioner';
import { getIn, formatName, formatAddress } from '../../../lib/tools';
import { useParams } from 'react-router-dom';
import { isFailure, isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import Spinner from '../../../components/Spinner';
import PractitionerSmartApps from './practitionerSmaprtApps.jsx';

export const PractitionerPatientProfile = () => {
  const { id } = useParams();
  useGate(practitionerModel.PatientGate, id);
  const patientResult = useStore(practitionerModel.$currentPatientResult);

  const name = getIn(patientResult, ['data', 'name', 0]);
  const birthDate = getIn(patientResult, ['data', 'birthDate']);
  const gender = getIn(patientResult, ['data', 'gender']);
  const address = getIn(patientResult, ['data', 'address', 0]);
  const language = getIn(patientResult, ['data', 'communication', 0, 'language', 'text']);

  return (
    <>
      <div className="flex flex-wrap -m-4">{isLoading(patientResult) && <Spinner />}</div>
      {isSuccess(patientResult) && (
        <>
          <div className="p-4 md:p-12 text-center lg:text-left">
            <div className="mb-6">
              <h1 className="text-3xl font-bold pt-8 lg:pt-0">{formatName(name)}</h1>
              <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-4 border-indigo-600 rounded" />
              <div className="pt-4 text-base flex items-center justify-center lg:justify-start">
                <span className="font-bold mr-1">Birthdate:</span>
                <span>{`${birthDate}`}</span>
              </div>
              <div className="pt-2 text-base flex items-center justify-center lg:justify-start">
                <span className="font-bold mr-1">Gender:</span>
                <span>{gender}</span>
              </div>
              <div className="pt-2 text-base flex items-center justify-center lg:justify-start">
                <span className="font-bold mr-1">Address:</span>
                <span>{`${formatAddress(address)}`}</span>
              </div>
              <div className="pt-2 text-base flex items-center justify-center lg:justify-start">
                <span className="font-bold mr-1">Language:</span>
                <span>{language}</span>
              </div>
            </div>
            <div className="w-1/5">
              <PractitionerSmartApps />
            </div>
          </div>
        </>
      )}
      {isFailure(patientResult) && (
        <div className="text-red-500 pl-4 font-medium">{patientResult.error}</div>
      )}
    </>
  );
};
