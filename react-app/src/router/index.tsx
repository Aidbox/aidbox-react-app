import { Navigate, useRoutes } from 'react-router-dom';
import { useStore } from 'effector-react';
import LoginPage from '../pages/login/index';
import NewPatientPage from '../pages/new-patient/index';
import Layout from '../layouts/apps';
import SmartApps from '../pages/smart-apps';
import { RoleSwitch } from '../components/RoleSwitch';
import { UserRole } from '../services/role';
import { $token, $user } from '../models/auth';
import { useEffect } from 'react';
import { setInstanceToken } from 'aidbox-react/lib/services/instance';

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
        { path: 'smart-apps', element: <SmartApps /> },
        { path: 'new-patient', element: <NewPatientPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/profile" /> },
  ],
  admin: [
    {
      element: <Layout role="admin" />,
      children: [{ path: 'new-patient', element: <NewPatientPage /> }],
    },
    { path: '*', element: <Navigate to="/new-patient" /> },
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

// type RoutesByRole = 'patient' | 'admin' | 'practitioner';

const loginRoutes = [
  {
    element: <LoginPage />,
    path: 'login',
  },
  { path: '*', element: <Navigate to="/login" /> },
];

export const AppRouter = () => {
  const token = useStore($token);
  useEffect(() => {
    const setToken = () => {
      if (token) {
        const resp = setInstanceToken(token);
      }
    };
    setToken();
  }, []);
  const user = useStore($user);
  // const role: RoutesByRole = getIn(user, ['role', 0, 'name']);
  const routes = token ? routesByRole['admin'] : loginRoutes;
  const main = useRoutes(routes);
  console.log(user);

  return main;
};
