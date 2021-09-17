import React from 'react';
import { useStore } from 'effector-react';

import { Patient } from './patient';
import { $patients } from '../model';

export const Patients = () => {
  const patients = useStore($patients);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-8">
          <div className="w-full mb-6 lg:mb-0">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">Patients</h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
        </div>
        <div className="flex flex-wrap -m-4">
          {patients.map((patient: any) => (
            <React.Fragment key={patient.id}>
              <Patient {...patient} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
