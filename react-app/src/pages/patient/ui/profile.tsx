import React, { useState } from 'react';
import cn from 'classnames';
import { PatientProfileGate } from '../model/patient';
import { useGate } from 'effector-react';
import Encounters from './encounters';
import Observations from './observations';
import Diagnoses from './diagnoses';

const tabs = ['Encounters', 'Observations', 'Diagnoses'];

export const PatientProfile = () => {
  const [currentTab, setCurrentTab] = useState('Encounters');
  useGate(PatientProfileGate);

  return (
    <div className="bg-white">
      <nav className="flex flex-col sm:flex-row">
        {tabs.map((tab: string) => (
          <button
            className={cn('text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none', {
              'text-blue-500 border-b-2 border-blue-500': currentTab === tab,
            })}
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      {currentTab === 'Encounters' && <Encounters />}
      {currentTab === 'Observations' && <Observations />}
      {currentTab === 'Diagnoses' && <Diagnoses />}
    </div>
  );
};
