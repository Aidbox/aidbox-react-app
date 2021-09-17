import { Outlet, Link as RouterLink } from 'react-router-dom';

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

const links = [
  {
    text: 'profile',
    path: 'profile',
  },
  {
    text: 'settings',
    path: 'settings',
  },
];

const linksByRole = {
  patient: [
    {
      text: 'profile',
      path: 'profile',
    },
    {
      text: 'settings',
      path: 'settings',
    },
  ],
  practitioner: [
    {
      text: 'Practitioner profile',
      path: 'practitioner-profile',
    },
    {
      text: 'Practitioner settings',
      path: 'practitioner-settings',
    },
  ],
};

const Layout = ({ role }: { role: 'practitioner' | 'patient' }) => {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-indigo-500">
        <div className="sidebar-content px-4 py-6">
          <ul className="flex flex-col w-full">
            {linksByRole[role].map((item) => (
              <Link {...item} />
            ))}
          </ul>
        </div>
      </aside>
      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <header className="header bg-white shadow py-4 px-4">
          <div className="header-content flex items-center flex-row">
            <div className="flex ml-auto">
              <a href="#" className="flex flex-row items-center">
                <img
                  src="https://pbs.twimg.com/profile_images/378800000298815220/b567757616f720812125bfbac395ff54_normal.png"
                  alt=""
                  className="h-10 w-10 bg-gray-200 border rounded-full"
                />
                <span className="flex flex-col ml-2">
                  <span className="truncate w-20 font-semibold tracking-wide leading-none">John Doe</span>
                  <span className="truncate w-20 text-gray-500 text-xs leading-none mt-1">Manager</span>
                </span>
              </a>
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
