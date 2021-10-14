import { Outlet, Link as RouterLink } from 'react-router-dom';
import { signOut } from '../auth';

const Link = ({ path, text }: { path: string; text: string }) => {
  return (
    <li className="my-px">
      <RouterLink
        to={path}
        className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700"
      >
        <span className="ml-3">{text}</span>
      </RouterLink>
    </li>
  );
};

const linksByRole = {
  admin: [
    {
      text: 'Patients',
      path: 'patients',
    },
    {
      text: 'Practitioners',
      path: 'practitioners',
    },
  ],
  patient: [
    {
      text: 'Profile',
      path: 'profile',
    },
    {
      text: 'Smart Apps',
      path: 'smart-apps',
    },
  ],
  practitioner: [
    {
      text: 'Patients',
      path: 'patients',
    },
    {
      text: 'Smart Apps',
      path: 'smart-apps',
    },
  ],
};

const Layout = ({ role }: { role: 'practitioner' | 'patient' | 'admin' }) => {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-indigo-500">
        <div className="sidebar-content px-4 py-6">
          <ul className="flex flex-col w-full">
            {linksByRole[role].map((item) => (
              <Link {...item} key={item.path} />
            ))}
          </ul>
        </div>
      </aside>
      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <header className="header bg-white shadow py-4 px-4">
          <div className="header-content flex items-center flex-row">
            <div className="flex ml-auto">
              <button
                type="button"
                onClick={() => signOut()}
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
