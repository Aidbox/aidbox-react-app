import React from 'react';
import { useStore, useGate } from 'effector-react';

import { SmartApp } from './app';
import * as smartAppModel from '../model';

export const SmartApps = () => {
  useGate(smartAppModel.Gate);
  const smartApps = useStore(smartAppModel.$apps);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-8">
          <div className="w-full mb-6 lg:mb-0">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">Smart Apps</h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
        </div>
        <div className="flex flex-wrap -m-4">
          {smartApps &&
            smartApps.map((smartApp: any) => (
              <React.Fragment key={smartApp.id}>
                <SmartApp {...smartApp} />
              </React.Fragment>
            ))}
        </div>
      </div>
    </section>
  );
};
