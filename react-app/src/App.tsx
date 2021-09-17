import { HomePage } from './pages/home-page';
import { useRoutes, BrowserRouter, Outlet } from 'react-router-dom';

const Apps = () => {
  return <div>Apps</div>;
};

const AppPage = () => {
  return (
    <div>
      <div> AppPage</div>
      <Outlet />
    </div>
  );
};

const AppPageKey = () => {
  return <div>AppPage key</div>;
};

const Layout = () => {
  return (
    <div>
      <ul>
        <li>asdfsadf</li>
        <li>asdfsadf</li>
        <li>asdfsadf</li>
      </ul>
      <div style={{ margin: '20' }}>
        <Outlet />
      </div>
    </div>
  );
};

// Outlet as yeild

const App = () => {
  const main = useRoutes([
    { path: '/', element: <HomePage /> },
    {
      path: '/apps',
      element: <Layout />,
      children: [
        { element: <Apps /> },
        { path: ':id', element: <AppPage />, children: [{ path: ':key', element: <AppPageKey /> }] },
      ],
    },
  ]);

  return main;
};

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
