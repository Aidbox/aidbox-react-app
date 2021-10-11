import { Navigate, Outlet, useLocation, useNavigate, useParams, useRoutes } from 'react-router-dom';
import { useGate, useStore } from 'effector-react';
import { AdminPatients, AdminPractitioners } from '../pages/admin/index';
import Layout from '../layouts/apps';
import { PatientSmartApps } from '../pages/patient-page';
import { $token, $user } from '../models/auth';
import { getIn } from '../lib/tools';
import { PatientProfile } from '../pages/patient-page/';
import PatientPage from '../pages/admin/ui/patientPage';
import PractitionerPage from '../pages/admin/ui/practitionerPage';
import ConsentForm from '../pages/consent-form';
import { HistoryGate } from '../models/router';
import { useEffect } from 'react';
import {
  PractitionerPatients,
  PractitionerPatientProfile,
  PractitionerSmartApps,
} from '../pages/practitioner-page/';
import { env } from '../env';

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

const routesByRole = {
  patient: [
    { path: 'auth/consent', element: <ConsentForm /> },
    {
      element: <RouterSpy />,
      children: [
        {
          element: <Layout role="patient" />,
          children: [
            { path: 'smart-apps', element: <PatientSmartApps /> },
            { path: 'profile', element: <PatientProfile /> },
          ],
        },
      ],
    },
    { path: '/', element: <Navigate to="/smart-apps" /> },
    { path: '*', element: <Navigate to="/smart-apps" /> },
  ],
  admin: [
    {
      element: <RouterSpy />,
      children: [
        {
          element: <Layout role="admin" />,
          children: [
            { path: 'patients', element: <AdminPatients /> },
            { path: 'patients/:id', element: <PatientPage /> },
            { path: 'practitioners', element: <AdminPractitioners /> },
            { path: 'practitioners/:id', element: <PractitionerPage /> },
          ],
        },
      ],
    },
    { path: '*', element: <Navigate to="/patients" /> },
  ],
  practitioner: [
    { path: 'auth/consent', element: <ConsentForm /> },

    {
      element: <RouterSpy />,
      children: [
        {
          element: <Layout role="practitioner" />,
          children: [
            { path: 'patients', element: <PractitionerPatients /> },
            { path: 'patients/:id', element: <PractitionerPatientProfile /> },
            { path: 'smart-apps', element: <PractitionerSmartApps /> },
          ],
        },
      ],
    },
    { path: '*', element: <Navigate to="/patients" /> },
  ],
};

type RoutesByRole = 'patient' | 'admin' | 'practitioner';

const Router = ({ routes }: any) => {
  const main = useRoutes(routes);
  return main;
};

export function RouterSpy() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  useGate(HistoryGate, { navigate, location, params });
  return <Outlet />;
}

export const AppRouter = () => {
  const user = useStore($user);
  const token = useStore($token);

  useEffect(() => {
    const serach = window.location.search;
    const params = new URLSearchParams(serach);

    const code = params.get('code');

    if (!token && !code) {
      const state = btoa(window.location.pathname + window.location.search);
      console.log(env, 'dfsdfsfs');
      window.location.href = `${env.AIDBOX_URL}/auth/authorize?redirect_uri=${env.FRONTEND_URL}&response_type=code&client_id=ui-portal&state=${state}`;
    }
  }, [token]);

  const role: RoutesByRole = getIn(user, ['data', 'role', 0, 'name']);
  const routes = role && routesByRole[role];

  return routes ? <Router routes={routes} /> : <RouterSpy />;
};
