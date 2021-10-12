import { isFailure, isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { useGate, useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import * as smartAppModel from '../../../models/smart-app';

const PractitionerSmartApps = () => {
  useGate(smartAppModel.SmartAppGate);
  const url_params = useParams();
  const smartAppsResult = useStore(smartAppModel.$smartApps);

  const patient_id = url_params.id;

  return (
    <>
      {isSuccess(smartAppsResult) &&
        smartAppsResult.data.map((smartApp: smartAppModel.SmartApp) => (
          <button
            className="bg-blue-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-blue-300 mb-4"
            onClick={() =>
              smartAppModel.getLaunchParam({ patient: { id: patient_id }, client: smartApp })
            }
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
