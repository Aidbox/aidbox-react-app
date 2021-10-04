import { useStore } from 'effector-react';
import { $currentPatient } from '../model';
import { getIn, formatName, formatAddress } from '../../../lib/tools';

const PatientProfile = () => {
  const patient = useStore($currentPatient);
  const name = getIn(patient, ['name', 0]);
  const address = getIn(patient, ['address', 0]);
  const language = getIn(patient, ['communication', 0, 'language', 'text']);

  return (
    <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
      <div className="w-full rounded shadow-2xl bg-white opacity-75 mx-6 lg:mx-0">
        <div className="p-4 md:p-12 text-center lg:text-left">
          <h1 className="text-3xl font-bold pt-8 lg:pt-0">{formatName(name)}</h1>
          <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-4 border-indigo-500 rounded" />
          <div className="pt-4 text-base flex items-center justify-center lg:justify-start">
            <span className="font-bold mr-1">Birthdate:</span>
            <span>{`${patient.birthDate}`}</span>
          </div>
          <div className="pt-2 text-base flex items-center justify-center lg:justify-start">
            <span className="font-bold mr-1">Gender:</span>
            <span>{patient.gender}</span>
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
      </div>
    </div>
  );
};

export default PatientProfile;
