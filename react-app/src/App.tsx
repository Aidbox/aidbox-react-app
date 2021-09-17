import { HomePage } from './pages/home-page';
import { useRoutes, BrowserRouter } from 'react-router-dom';
import Layout from './layouts/apps';

const Profile = () => <div>Profile</div>;
const Settings = () => <div>Settings</div>;
const PracProfile = () => <div>Prac Profile</div>;
const PracSettings = () => <div>Prac Settings</div>;

const routesByRole = {
  patient: [
    {
      element: <Layout role="patient" />,
      children: [
        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
  ],
  practitioner: [
    {
      element: <Layout role="practitioner" />,
      children: [
        { path: 'practitioner-profile', element: <PracProfile /> },
        { path: 'practitioner-settings', element: <PracSettings /> },
      ],
    },
  ],
};

// Outlet as yeild

const App = () => {
  const routes = routesByRole['patient'];
  const main = useRoutes(routes);

  return main;
};

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
