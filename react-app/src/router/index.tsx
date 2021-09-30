import { Navigate, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { useGate, useStore } from 'effector-react';
import LoginPage from '../pages/login/index';
import AdminPage from '../pages/admin/index';
import Layout from '../layouts/apps';
import SmartApps from '../pages/patient-page';
import { RoleSwitch } from '../components/RoleSwitch';
import { UserRole } from '../services/role';
import { $startUrl, $token, $user, setStartUrlFx, setTokenFx } from '../models/auth';
import { getIn } from '../lib/tools';
import Profile from '../pages/patient-page/ui/profile';
import PatientProfilePage from '../pages/admin/ui/patientProfile';
import ConsentForm from '../pages/consent-form';
import { HistoryGate, navigateTo } from '../models/router';
import { useEffect } from 'react';

/* const Profile = () => {
  return (
    <RoleSwitch>
      {{
        [UserRole.Patient]: () => <div>Patient Profile</div>,
        [UserRole.Practitioner]: () => <div>Practitioner profile</div>,
      }}
    </RoleSwitch>
  );
}; */

const Settings = () => <div>Settings</div>;
const PracSettings = () => <div>Prac Settings</div>;

const routesByRole = {
  patient: [
    { path: 'auth/consent', element: <ConsentForm /> },
    {
      element: <Layout role="patient" />,
      children: [
        { path: 'smart-apps', element: <SmartApps /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
    { path: '*', element: <Navigate to="/smart-apps" /> },
  ],
  admin: [
    {
      element: <Layout role="admin" />,
      children: [
        { path: 'patients', element: <AdminPage /> },
        { path: 'patients/:id', element: <PatientProfilePage /> },
      ],
    },
    { path: '*', element: <Navigate to="/patients" /> },
  ],
  practitioner: [
    {
      element: <Layout role="practitioner" />,
      children: [
        // { path: 'practitioner-profile', element: <Profile /> },
        { path: 'practitioner-settings', element: <PracSettings /> },
      ],
    },
  ],
};

type RoutesByRole = 'patient' | 'admin' | 'practitioner';

const Router = ({ routes }: any) => {
  const main = useRoutes(routes);
  return (
    <>
      <RouterSpy />
      {main}
    </>
  );
};

export function RouterSpy() {
  const navigate = useNavigate();
  const location = useLocation();
  useGate(HistoryGate, { navigate, location });
  return null;
}

export const AppRouter = () => {
  const user = useStore($user);
  const token = useStore($token);
  useEffect(() => {
    const serach = window.location.search;
    const params = new URLSearchParams(serach);
    console.log(params, 'tut');
    // if (!token) {
    //   window.location.href =
    //     'http://localhost:8888/auth/authorize?redirect_uri=http://localhost:3000/&response_type=code&client_id=ui-portal';
    // }
  }, [token]);
  /*const status: 'loading' | 'done' | 'idle' = user.status;
  const main = {
    idle: () => (token ? <div>Idle loading...</div> : <Router routes={loginRoutes} />),
    done: () => {
      const role: RoutesByRole = getIn(user, ['data', 'role', 0, 'name']);
      const routes = role ? routesByRole[role] : loginRoutes;
      return <Router routes={routes} />;
    },
    loading: () => <div>Loading...</div>,
  }[status];

  return main(); */
  return <RouterSpy />;
};
