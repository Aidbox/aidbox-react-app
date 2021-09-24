import React from 'react';
import { useStore, useGate } from 'effector-react';

import { getIn, formatName } from '../../../lib/tools';
import * as admin from '../model';

export const Patients = () => {
  const patients = useStore(admin.$patients);
  useGate(admin.PatientsGate);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-8">
          <div className="w-full mb-6 lg:mb-0">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
              Patients
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-full">
            <div className="border-b border-gray-200 shadow w-full">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-2 text-xs text-gray-500">Name</th>
                    <th className="px-6 py-2 text-xs text-gray-500">Email</th>
                    <th className="px-6 py-2 text-xs text-gray-500">Birthdate</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {patients.map((p: any) => {
                    const { resource } = p;
                    const name = getIn(resource, ['name', 0]);
                    return (
                      <tr className="whitespace-nowrap">
                        <td className="px-6 py-4 text-sm text-gray-500">{formatName(name)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{resource.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{resource.birthdate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
