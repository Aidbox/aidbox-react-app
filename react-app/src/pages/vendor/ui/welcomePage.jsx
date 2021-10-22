import { redirectToLogin } from '../model/enrollment';

export const WelcomePage = () => {
  return (
    <div className="px-5 py-24 flex flex-col justify-center space-y-32">
      <div className="flex flex-wrap w-full mt-20">
        <div className="w-full mb-6 lg:mb-0 flex justify-center">
          <div>
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
              Smart On FHIR Sandbox For Developers
            </h1>
            <div className="h-1 w-20 bg-indigo-600 rounded"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-5 w-1/5 mx-auto">
        <button
          className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          onClick={() => {
            redirectToLogin();
          }}
        >
          Log in
        </button>
        <button className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
          Sign up
        </button>
      </div>
    </div>
  );
};
