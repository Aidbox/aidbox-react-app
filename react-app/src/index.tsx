import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { setStartUrlFx } from './models/auth';

setStartUrlFx({ pathname: window.location.pathname, search: window.location.search });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
