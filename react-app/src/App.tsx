import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AppRouter } from './router';

// Outlet as yeild
export default () => (
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);
