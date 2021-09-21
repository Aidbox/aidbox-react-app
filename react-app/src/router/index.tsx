import LoginPage from '../pages/login/index';
import { Navigate, useRoutes } from 'react-router-dom';
import Layout from '../layouts/apps';
import { RoleSwitch } from '../components/RoleSwitch';
import { UserRole } from '../services/role';
import { useStore } from 'effector-react';
import { $token, $user } from '../models/auth';

const Profile = () => {
  return (
    <RoleSwitch>
      {{
        [UserRole.Patient]: () => <div>Patient Profile</div>,
        [UserRole.Practitioner]: () => <div>Practitioner profile</div>,
      }}
    </RoleSwitch>
  );
};
const Settings = () => <div>Settings</div>;
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
    { path: '*', element: <Navigate to="/profile" /> },
  ],
  practitioner: [
    {
      element: <Layout role="practitioner" />,
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
  { path: '*', element: <Navigate to="/login" /> },
];

export const AppRouter = () => {
  const token = useStore($token);
  const user = useStore($user);
  const routes = token ? routesByRole['patient'] : loginRoutes;
  const main = useRoutes(routes);

  return main;
};
