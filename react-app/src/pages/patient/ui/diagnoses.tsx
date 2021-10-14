import React from 'react';
import { $diagnoses } from '../model/patient';
import { useStore } from 'effector-react';
import Table from '../../../components/Table';
import { getIn } from '../../../lib/tools';
import { Condition } from 'shared/src/contrib/aidbox';

const labels = ['Clinical status', 'Verification status', 'Diagnose', 'Date'];

const Diagnoses = () => {
  const diagnoses = useStore($diagnoses);
  if (!diagnoses || !diagnoses.length) {
    return null;
  }

  const dataToDisplay = diagnoses.map((condition: Condition) => {
    const clinicalStatus = getIn(condition, ['clinicalStatus', 'coding', 0, 'code']);
    const verificationStatus = getIn(condition, ['verificationStatus', 'coding', 0, 'code']);
    const dateTime = getIn(condition, ['abatement', 'dateTime']);
    const text = getIn(condition, ['code', 'text']);

    return [clinicalStatus, verificationStatus, text, dateTime];
  });

  return <Table labels={labels} data={dataToDisplay} />;
};

export default Diagnoses;
