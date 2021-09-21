import LoginPage from './pages/login/index';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Layout from './layouts/apps';
import { RoleSwitch } from './components/RoleSwitch';
import { UserRole } from './services/role';

const Profile = () => {
  return <RoleSwitch>{{
    [UserRole.Patient]: () => <div>Patient Profile</div>,
    [UserRole.Practitioner]: () => <div>Practitioner profile</div>,
  }}</RoleSwitch>;
};
const Settings = () => <div>Settings</div>;
const PracSettings = () => <div>Prac Settings</div>;

const routesByRole = {
  patient: [
    {
      element: <Layout role='patient' />,
      children: [
        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
  ],
  practitioner: [
    {
      element: <Layout role='practitioner' />,
      children: [
        { path: 'practitioner-profile', element: <Profile /> },
        { path: 'practitioner-settings', element: <PracSettings /> },
      ],
    },
  ],
};

const loginRoutes = [
  {
    element: <LoginPage />,
    path: 'login',
  },
];

// Outlet as yeild

const App = () => {
  // const token = (async () => await box.getToken())();
  const token = true;
  const routes = token ? routesByRole['patient'] : loginRoutes;
  const main = useRoutes(routes);

  return main;
};

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
