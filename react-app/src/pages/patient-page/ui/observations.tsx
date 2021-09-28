import React from 'react';
import { $observations } from '../model';
import { useStore } from 'effector-react';
import Table from '../../../components/Table';

const labels = ['Status', 'Type', 'Date'];

const Observations = () => {
  const observations = useStore($observations);
  if (!observations || !observations.length) {
    return null;
  }

  const dataToDisplay = observations.map((encouter: any) => {
    const {
      status,
      code: { text },
      effective: { dateTime },
    } = encouter;
    return [status, text, dateTime];
  });

  return <Table labels={labels} data={dataToDisplay} />;
};

export default Observations;
