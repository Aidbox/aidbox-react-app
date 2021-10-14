import React from 'react';
import { $observations } from '../model/patient';
import { useStore } from 'effector-react';
import Table from '../../../components/Table';
import { Observation } from 'shared/src/contrib/aidbox';
import { getIn } from '../../../lib/tools';

const labels = ['Status', 'Type', 'Date'];

const Observations = () => {
  const observations = useStore($observations);
  if (!observations || !observations.length) {
    return null;
  }

  const dataToDisplay = observations.map((observation: Observation) => {
    const dateTime = getIn(observation, ['effective', 'dateTime']);
    const {
      status,
      code: { text },
    } = observation;
    return [status, text, dateTime];
  });

  return <Table labels={labels} data={dataToDisplay} />;
};

export default Observations;
