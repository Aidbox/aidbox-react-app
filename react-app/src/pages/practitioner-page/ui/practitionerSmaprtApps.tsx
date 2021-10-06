import { isFailure, isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { useGate, useStore } from 'effector-react';
import * as smartAppModel from '../../../models/smart-app';

const PractitionerSmartApps = () => {
  useGate(smartAppModel.SmartAppGate);
  const smartAppsResult = useStore(smartAppModel.$smartApps);

  return (
    <>
      {isSuccess(smartAppsResult) &&
        smartAppsResult.data.map((smartApp: smartAppModel.SmartApp) => (
          <button
            className="bg-blue-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-blue-300 mb-4"
            onClick={() => smartAppModel.getLaunchParam(smartApp)}
          >
            {smartApp.name}
          </button>
        ))}
      {isFailure(smartAppsResult) && null}
      {isLoading(smartAppsResult) && null}
    </>
  );
};

export default PractitionerSmartApps;
