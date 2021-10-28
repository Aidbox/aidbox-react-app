import { Navigate, Outlet, useLocation, useNavigate, useParams, useRoutes } from 'react-router-dom';
import { useGate, useStore } from 'effector-react';

import Layout from '../layouts/apps';
import {
  AdminPatientPage,
  AdminPractitionerPage,
  AdminPatients,
  AdminPractitioners,
} from '../pages/admin/index';
import { PatientSmartApps, PatientProfile } from '../pages/patient';
import { ConsentForm, SelectPatientPage } from '../pages/smart';
import {
  PractitionerPatients,
  PractitionerPatientProfile,
  PractitionerSmartApps,
} from '../pages/practitioner';

import { $token, $user } from '../auth';
import { getIn } from '../lib/tools';
import { HistoryGate } from '../history';
import { useEffect } from 'react';
import { env } from '../env';
import { SignupForm, SmartAppForm, VendorSmartApps, WelcomePage } from '../pages/vendor';

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
            { path: 'patients/:id', element: <AdminPatientPage /> },
            { path: 'practitioners', element: <AdminPractitioners /> },
            { path: 'practitioners/:id', element: <AdminPractitionerPage /> },
          ],
        },
      ],
    },
    { path: '/', element: <Navigate to="/patients" /> },
    { path: '*', element: <Navigate to="/patients" /> },
  ],
  practitioner: [
    { path: 'auth/select-patient', element: <SelectPatientPage /> },
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
    { path: '/', element: <Navigate to="/patients" /> },
    { path: '*', element: <Navigate to="/patients" /> },
  ],
  vendor: [
    { path: 'auth/select-patient', element: <SelectPatientPage /> },
    { path: 'auth/consent', element: <ConsentForm /> },
    {
      element: <RouterSpy />,
      children: [
        {
          element: <Layout role="vendor" />,
          children: [
            { path: 'smart-apps', element: <VendorSmartApps /> },
            { path: 'smart-apps/:id', element: <SmartAppForm /> },
          ],
        },
      ],
    },
    { path: '/', element: <Navigate to="/smart-apps" /> },
    { path: '*', element: <Navigate to="/smart-apps" /> },
  ],
  superadmin: [],
};

const welcomeRoutes = [
  { path: '*', element: <Navigate to="/welcome" /> },
  { path: 'welcome', element: <WelcomePage /> },
  { path: 'signup', element: <SignupForm /> },
];

type RoutesByRole = 'patient' | 'admin' | 'practitioner' | 'superadmin' | 'vendor';

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
  const role: RoutesByRole = getIn(user, ['data', 'role', 0, 'name']);

  useEffect(() => {
    if (role === 'superadmin') {
      window.location.href = env.AIDBOX_URL;
    }
  }, [token, role]);

  const serach = window.location.search;
  const params = new URLSearchParams(serach);
  const code = params.get('code');

  if (!token && !code) {
    return <Router routes={welcomeRoutes} />;
  }

  const routes = role && routesByRole[role];
  return routes ? <Router routes={routes} /> : <RouterSpy />;
};
