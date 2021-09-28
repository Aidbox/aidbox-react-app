import React from 'react';
import { $encounters } from '../model';
import { useStore } from 'effector-react';
import Table from '../../../components/Table';

const labels = ['Status', 'Period'];

const Encounters = () => {
  const encouters = useStore($encounters);
  if (!encouters || !encouters.length) {
    return null;
  }

  const dataToDisplay = encouters.map((encouter: any) => {
    const {
      status,
      period: { start, end },
    } = encouter;
    return [status, `${start} - ${end}`];
  });

  return <Table labels={labels} data={dataToDisplay} />;
};

export default Encounters;
