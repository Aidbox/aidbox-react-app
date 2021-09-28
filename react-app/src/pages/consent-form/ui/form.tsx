import { useLocation } from 'react-router';
import { accessGrant } from '../model';

const Form = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uri = searchParams.get('redirect_uri');
  const state: any = searchParams.get('state');
  const newSearchParams = new URLSearchParams({
    state,
    error: 'invalid_scope',
  }).toString();
  const url = `${uri}?${newSearchParams}`;

  const scope = searchParams.get('scope');
  const clientId = searchParams.get('client_id');
  const accessGrantData: any = { scope, clientId };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="rounded-md shadow-sm bg-white p-5">
          <h1 className="mb-5 text-center text-3xl font-extrabold text-gray-900">
            Grow chart has asked for some of your data.
          </h1>
          <ul className="list-disc pl-5 mb-5">
            <li className="mb-1">Information about your doctor/hospital visits</li>
            <li className="mb-1">Information about prescription medication you take</li>
            <li className="mb-1">
              Personal information like your name, address, date of birth, gender
            </li>
          </ul>
          <div className="flex justify-between">
            <a
              href={url}
              className="flex justify-center py-2 px-4 bg-red-500 border border-transparent text-sm font-medium rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Deny
            </a>
            <button
              onClick={() => accessGrant(accessGrantData)}
              className="flex justify-center py-2 px-4 bg-green-500 border border-transparent text-sm font-medium rounded-md text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
