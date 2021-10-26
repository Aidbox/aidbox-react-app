import { useStore, useGate } from 'effector-react';
import { Link } from 'react-router-dom';
import { $user } from '../../../auth';
import Spinner from '../../../components/Spinner';
import * as smartAppModel from '../model/smartApp.js';

export const VendorSmartApps = () => {
  const userInfo = useStore($user);
  const dataInitialized = useStore(smartAppModel.$dataInitialized);
  useGate(smartAppModel.SmartAppGate, userInfo.data.id);
  const smartAppsResult = useStore(smartAppModel.$smartApps);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-8 justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
              Smart Apps
            </h1>
            <div className="h-1 w-20 bg-indigo-600 rounded"></div>
          </div>
          <div>
            {!dataInitialized && (
              <button
                className="bg-indigo-600 px-5 py-3 w-48 mr-4 text-white rounded-lg text-center hover:bg-indigo-300 mb-4"
                onClick={() => smartAppModel.initializeData(userInfo.data.id)}
              >
                Initialize Data
              </button>
            )}
            <button
              onClick={() => smartAppModel.createApp(userInfo.data.id)}
              className="bg-indigo-600 px-5 py-3 w-48 text-white rounded-lg text-center hover:bg-indigo-300 mb-4"
            >
              Create a New App
            </button>
          </div>
        </div>
        {smartAppsResult.status === 'failure' && (
          <div className="flex flex-wrap -m-4">
            <div className="text-red-500 pl-4 font-medium">{smartAppsResult.error}</div>
          </div>
        )}
        {smartAppsResult.status === 'loading' && (
          <div className="flex flex-wrap -m-4">
            <Spinner />
          </div>
        )}
        {smartAppsResult.status === 'success' && (
          <div className="flex flex-wrap -m-4">
            {smartAppsResult.data.map((smartApp) => {
              const { id, secret, name, logo_url } = smartApp;

              return (
                <>
                  <div className="p-4  w-full" key={smartApp.id}>
                    <div className="flex items-center p-10 w-full h-full bg-white">
                      <div className="grid grid-cols-12 gap-8 w-full">
                        <div className="flex flex-col justify-start col-span-2">
                          <img className="w-4/5 h-4/5 object-contain" src={logo_url} alt="" />
                        </div>
                        <div className="flex flex-col col-span-8">
                          <div className="flex flex-col gap-4">
                            <h1 className="capitalize text-4xl font-extrabold">{name}</h1>
                            <div>
                              <div>
                                <span className="font-bold pr-2">Client ID:</span>
                                <span>{id}</span>
                              </div>
                              <div>
                                <span className="font-bold pr-2">Secret:</span>
                                <span>{secret}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col col-span-2">
                          {/* <a
                          href={`${launch_uri}?iss=${env.PATIENT_SMART_BASE_URL}`}
                          target="_blank"
                          className="bg-indigo-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-indigo-300 mb-4"
                          rel="noreferrer"
                        >
                          Launch App
                        </a> */}
                          {/* <button
                          className="bg-indigo-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-indigo-300"
                          onClick={() => revokeGrant(id)}
                        >
                          Revoke Grant
                        </button> */}
                          <Link to={`/smart-apps/${id}`}>
                            <div className="bg-indigo-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-indigo-300">
                              Edit App
                            </div>
                          </Link>
                          <button
                            className="bg-white px-5 py-3 my-4 text-gray-400 border-2 border-gray-400 rounded-lg w-full text-center hover:bg-red-600 hover:text-white hover:border-transparent"
                            onClick={() => smartAppModel.removeApp(id)}
                          >
                            Remove App
                          </button>
                          {dataInitialized && (
                            <button
                              className="bg-indigo-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-indigo-300"
                              onClick={() => smartAppModel.openModal()}
                            >
                              Launch App
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                    id="my-modal"
                  >
                    <div className="relative top-1/3 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                      <div className="flex justify-end">
                        <svg
                          className="w-6 h-6 cursor-pointer"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => smartAppModel.closeModal()}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <div className="text-center px-7 flex-auto justify-center">
                        <h2 className="text-xl font-bold p-4">
                          Choose who you want to run the application for?
                        </h2>
                      </div>
                      <div className="mt-10 text-center space-x-4 md:block w-full">
                        <button className="bg-indigo-600 px-5 py-3 w-1/3 text-white rounded-lg text-center hover:bg-indigo-300">
                          Patient
                        </button>
                        <button className="bg-indigo-600 px-5 py-3 w-1/3 text-white rounded-lg text-center hover:bg-indigo-300">
                          Practitioner
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
