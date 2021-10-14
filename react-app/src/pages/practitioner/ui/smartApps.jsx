import React from 'react';
import { useStore, useGate } from 'effector-react';
import Spinner from '../../../components/Spinner';
import { env } from '../../../env';
import * as smartAppModel from '../model/smartApp.js';

export const PractitionerSmartApps = () => {
  useGate(smartAppModel.SmartAppGate);
  const smartAppsResult = useStore(smartAppModel.$smartApps);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-8">
          <div className="w-full mb-6 lg:mb-0">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
              Smart Apps
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
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
              const { description, launch_uri, logo_url, name } = smartApp;

              return (
                <div className="p-4  w-full" key={smartApp.id}>
                  <div className="flex items-center p-10 w-full h-full bg-white">
                    <div className="grid grid-cols-12 gap-8 w-full">
                      <div className="flex flex-col justify-start col-span-2">
                        <img className="w-4/5 h-4/5 object-contain" src={logo_url} alt="" />
                      </div>
                      <div className="flex flex-col col-span-8">
                        <div className="flex flex-col gap-4">
                          <h1 className="capitalize text-4xl font-extrabold">{name}</h1>
                          <p className="text-lg text-gray-500">{description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <a
                          href={`${launch_uri}?iss=${env.PATIENT_SMART_BASE_URL}`}
                          target="_blank"
                          className="bg-blue-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-blue-300 mb-4"
                          rel="noreferrer"
                        >
                          Launch App
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
