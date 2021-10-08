import { revokeGrant } from '../../../models/auth/index';
import * as smartAppModel from '../../../models/smart-app';
import { env } from '../../../env';

export const SmartApp = (app: smartAppModel.SmartApp) => {
  const { description, launch_uri, logo_url, name, id } = app;
  return (
    <div className="p-4  w-full">
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
            <button
              className="bg-blue-600 px-5 py-3 text-white rounded-lg w-full text-center hover:bg-blue-300"
              onClick={() => revokeGrant(id)}
            >
              Revoke Grant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
