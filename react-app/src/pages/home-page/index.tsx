import { useGate } from 'effector-react';

import { Patients } from './ui/patients';
import { Gate } from './model';

export const HomePage = () => {
  useGate(Gate);
  return (
    <div>
      <Patients />
    </div>
  );
};
