import React from 'react';
import { $diagnoses } from '../model';
import { useStore } from 'effector-react';
import Table from '../../../components/Table';
import { getIn } from '../../../lib/tools';

const labels = ['Clinical status', 'Verification status', 'Diagnose', 'Date'];

const Diagnoses = () => {
  const diagnoses = useStore($diagnoses);
  if (!diagnoses || !diagnoses.length) {
    return null;
  }

  const dataToDisplay = diagnoses.map((encouter: any) => {
    const clinicalStatus = getIn(encouter, ['clinicalStatus', 'coding', 0, 'code']);
    const verificationStatus = getIn(encouter, ['verificationStatus', 'coding', 0, 'code']);
    const dateTime = getIn(encouter, ['abatement', 'dateTime']);
    const {
      code: { text },
    } = encouter;
    return [clinicalStatus, verificationStatus, text, dateTime];
  });

  return <Table labels={labels} data={dataToDisplay} />;
};

export default Diagnoses;
