import { useGate, useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import * as smartAppModel from '../model/smartApp';

const PractitionerSmartApps = () => {
  useGate(smartAppModel.SmartAppGate);
  const url_params = useParams();
  const smartAppsResult = useStore(smartAppModel.$smartApps);

  const patient_id = url_params.id;

  return (
    <>
      {smartAppsResult.status === 'success' &&
        smartAppsResult.data.map((smartApp) => (
          <button
            className="bg-indigo-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-indigo-300 mb-4"
            key={smartApp.id}
            onClick={() =>
              smartAppModel.getLaunchParam({
                patient: { id: patient_id },
                client: { id: smartApp.id },
              })
            }
          >
            {smartApp.name}
          </button>
        ))}
    </>
  );
};

export default PractitionerSmartApps;
