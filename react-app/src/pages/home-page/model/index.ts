import { sample, createDomain } from 'effector';
import { createGate } from 'effector-react';

const domain = createDomain('home-page');

export const $patients = domain.createStore([]);

export const downloadData = domain.createEvent();

export const Gate = createGate();
