import React from 'react';
import { $encounters } from '../model/patient';
import { useStore } from 'effector-react';
import Table from '../../../components/Table';
import { Encounter } from 'shared/src/contrib/aidbox';
import { getIn } from '../../../lib/tools';

const labels = ['Status', 'Period'];

const Encounters = () => {
  const encouters = useStore($encounters);
  if (!encouters || !encouters.length) {
    return null;
  }

  const dataToDisplay = encouters.map((encouter: Encounter) => {
    const start = getIn(encouter, ['period', 'start']);
    const end = getIn(encouter, ['period', 'end']);
    const { status } = encouter;
    return [status, `${start} - ${end}`];
  });

  return <Table labels={labels} data={dataToDisplay} />;
};

export default Encounters;
