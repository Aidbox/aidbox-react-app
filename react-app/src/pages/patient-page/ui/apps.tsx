import React from 'react';
import { useStore, useGate } from 'effector-react';

import { SmartApp } from './app';
import * as smartAppModel from '../model';
import { getStatus } from '../../../models/domain';
import Spinner from '../../../components/Spinner';

export const SmartApps = () => {
  useGate(smartAppModel.SmartAppGate);
  const smartApps = useStore(smartAppModel.$apps);
  const smartAppsStatus = getStatus(smartAppModel.downloadAppsFx);

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
        <div className="flex flex-wrap -m-4">
          {smartAppsStatus.fail && (
            <div className="text-red-500 pl-4 font-medium">{smartAppsStatus.error}</div>
          )}
        </div>
        <div className="flex flex-wrap -m-4">{smartAppsStatus.pending && <Spinner />}</div>
        <div className="flex flex-wrap -m-4">
          {smartAppsStatus.success &&
            smartApps.map((smartApp: smartAppModel.App) => (
              <React.Fragment key={smartApp.id}>
                <SmartApp {...smartApp} />
              </React.Fragment>
            ))}
        </div>
      </div>
    </section>
  );
};
