import { useStore, useGate } from 'effector-react';
import { useLocation } from 'react-router-dom';

import { getIn, formatName } from '../../../lib/tools';
import * as practitionerModel from '../model/selectPatient';
import * as smartAppModel from '../model/smartApp';
import { isFailure, isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import Spinner from '../../../components/Spinner';
import { Patient } from 'shared/src/contrib/aidbox';

export const SelectPatientPage = () => {
  useGate(practitionerModel.PatientsGate);
  const { search } = useLocation();
  const client_id = new URLSearchParams(search).get('client_id');
  const patientsResult = useStore(practitionerModel.$patientsResult);

  return (
    <section className="text-gray-600 body-font">
      <div className="flex flex-wrap -m-4">{isLoading(patientsResult) && <Spinner />}</div>
      {isSuccess(patientsResult) && (
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-8">
            <div className="w-full mb-6 lg:mb-0">
              <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
                Pick Patient
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="w-full">
              <div className="border-b border-gray-200 shadow w-full">
                <div className="w-full">
                  <div className="bg-gray-50">
                    <div className="grid grid-rows-1 grid-cols-2">
                      <div className="px-6 py-2 text-xs text-gray-500">Name</div>
                      <div className="px-6 py-2 text-xs text-gray-500">Birthdate</div>
                    </div>
                  </div>
                  <div className="bg-white">
                    {patientsResult.data.map((patient: Patient) => {
                      const { id } = patient;
                      const name = getIn(patient, ['name', 0]);

                      return (
                        <div
                          className="grid grid-rows-1 grid-cols-2 whitespace-nowrap hover:bg-gray-100 cursor-pointer border-b-2 border-gray-100"
                          key={id}
                          onClick={() =>
                            smartAppModel.getLaunchParam({
                              patient: { id },
                              client: { id: client_id },
                            })
                          }
                        >
                          <div className="px-6 py-4 text-sm text-gray-500">{formatName(name)}</div>
                          <div className="px-6 py-4 text-sm text-gray-500">{patient.birthDate}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isFailure(patientsResult) && (
        <div className="text-red-500 pl-4 font-medium">{patientsResult.error}</div>
      )}
    </section>
  );
};
