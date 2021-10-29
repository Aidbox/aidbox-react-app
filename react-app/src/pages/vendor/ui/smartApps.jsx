import { useStore, useGate } from 'effector-react';
import { Link } from 'react-router-dom';
import { $user } from '../../../auth';
import Spinner from '../../../components/Spinner';
import { env } from '../../../env';
import { getIn } from '../../../lib/tools';
import cn from 'classnames';
import * as smartAppModel from '../model/smartApp.js';

export const VendorSmartApps = () => {
  var userInfo = useStore($user);
  const dataInitialized = useStore(smartAppModel.$dataInitialized);
  useGate(smartAppModel.SmartAppGate, userInfo.data.id);
  const smartAppsResult = useStore(smartAppModel.$smartApps);
  const patientRole = userInfo.data.role.find((item) => item.name === 'patient');
  const patientId = getIn(patientRole, ['links', 'patient', 'id']);
  const grantExists = useStore(smartAppModel.$grantExists);

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
              const { id, secret, name, launch_uri, logo_url } = smartApp;

              return (
                <>
                  <div className="p-4  w-full" key={id}>
                    <div className="flex items-center px-10 py-6 w-full h-full bg-white">
                      <div className="grid grid-cols-12 gap-8 w-full items-center">
                        <div className="flex flex-col justify-start col-span-2">
                          <img className="w-4/5 h-4/5 object-contain" src={logo_url} alt="" />
                        </div>
                        <div className="flex flex-col col-span-8">
                          <div className="flex flex-col gap-4">
                            <h1 className="capitalize text-4xl font-extrabold">{name}</h1>
                            <div>
                              <div>
                                <span className="font-bold pr-2">Client ID</span>
                                <div className="flex items-center space-x-2">
                                  <input
                                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-1 pl-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                                    type="text"
                                    disabled={true}
                                    value={id}
                                    id={id + '-id'}
                                  />
                                  <div
                                    className="w-6 cursor-pointer tooltip"
                                    onClick={() => smartAppModel.copy(id + '-id')}
                                    onMouseLeave={() =>
                                      smartAppModel.copyMouseOut(id + '-id-tooltip')
                                    }
                                  >
                                    <span className="tooltiptext" id={id + '-id-tooltip'}>
                                      Copy to clipboard
                                    </span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="feather feather-copy"
                                    >
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="font-bold pr-2">Secret</span>
                                <div className="flex items-center space-x-2">
                                  <input
                                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-1 pl-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                                    type="text"
                                    disabled={true}
                                    value={secret}
                                    id={id + '-secret'}
                                  />
                                  <div
                                    className="w-6 cursor-pointer tooltip"
                                    onClick={() => smartAppModel.copy(id + '-secret')}
                                    onMouseLeave={() =>
                                      smartAppModel.copyMouseOut(id + '-secret-tooltip')
                                    }
                                  >
                                    <span className="tooltiptext" id={id + '-secret-tooltip'}>
                                      Copy to clipboard
                                    </span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="feather feather-copy"
                                    >
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col col-span-2">
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
                              onClick={() => smartAppModel.openModal(id)}
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
                    id={id}
                  >
                    <div className="relative top-1/4 mx-auto p-5 pb-8 border w-1/2 shadow-lg rounded-md bg-white">
                      <div className="flex justify-end">
                        <svg
                          className="w-6 h-6 cursor-pointer"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => smartAppModel.closeModal(id)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold p-4">Select a launch scenario:</h2>
                      <div>
                        <div className="grid grid-cols-10 gap-8 border-2 rounded-t-lg w-full h-28 py-2 px-4">
                          <div className="col-span-8 flex flex-col justify-center">
                            <h3 className="text-lg font-bold">EHR Patient Launch</h3>
                            <div>
                              Assume the role of a Patient and launch the app with your patient
                              context.
                            </div>
                          </div>
                          <div className="col-span-2 flex flex-col justify-center space-y-2">
                            <button
                              className={cn(
                                {
                                  'bg-indigo-600 w-full py-3 text-white rounded-lg text-center hover:bg-indigo-300':
                                    !grantExists,
                                },
                                {
                                  'bg-indigo-600 w-full py-2 text-white rounded-lg text-center hover:bg-indigo-300':
                                    grantExists,
                                },
                              )}
                              onClick={() =>
                                smartAppModel.getLaunchParam({
                                  patient: { id: patientId },
                                  client: { id },
                                })
                              }
                            >
                              Launch
                            </button>
                            {grantExists && (
                              <button
                                className="bg-indigo-600 px-5 py-2 text-white rounded-lg w-full text-center  hover:bg-indigo-300"
                                onClick={() => smartAppModel.revokeGrant(id)}
                              >
                                Revoke Grant
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-10 gap-8 border-2 border-t-0 w-full h-28 py-2 px-4">
                          <div className="col-span-8 flex flex-col justify-center">
                            <h3 className="text-lg font-bold">EHR Practitioner Launch</h3>
                            <div className="">
                              Assume the role of a Practitioner and launch the app with a patient
                              context.
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <button
                              className="bg-indigo-600 w-full py-3 text-white rounded-lg text-center hover:bg-indigo-300"
                              onClick={() =>
                                smartAppModel.getLaunchParam({
                                  patient: { id: patientId },
                                  client: { id },
                                })
                              }
                            >
                              Launch
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-10 gap-8 border-2 border-t-0 rounded-b-lg w-full h-28 py-2 px-4">
                          <div className="col-span-8 flex flex-col justify-center">
                            <h3 className="text-lg font-bold">Standalone Practitioner Launch </h3>
                            <div className="">
                              Assume the role of a Practitioner and launch the app without a patient
                              context. You will be prompted to select a patient.
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <a
                              className="bg-indigo-600 w-full py-3 text-white rounded-lg text-center hover:bg-indigo-300"
                              href={`${launch_uri}?iss=${env.PATIENT_SMART_BASE_URL}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => smartAppModel.closeModal(id)}
                            >
                              Launch
                            </a>
                          </div>
                        </div>
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
