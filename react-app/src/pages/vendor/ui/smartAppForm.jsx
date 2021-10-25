import { useGate, useStore } from 'effector-react';
import { useForm } from 'effector-forms';
import { useParams } from 'react-router-dom';
import { getIn } from '../../../lib/tools';
import Spinner from '../../../components/Spinner';
import * as vendor from '../model/smartApp.js';

export const SmartAppForm = () => {
  const { id } = useParams();
  useGate(vendor.SmartAppFormGate, id);
  const smartAppResult = useStore(vendor.$smartApp);
  const updateStatus = useStore(vendor.$updateStatus);
  const { fields } = useForm(vendor.form);

  const onSubmit = (e) => {
    e.preventDefault();
    vendor.submitForm();
  };

  return (
    <div className="container px-5 py-24 mx-auto">
      {smartAppResult.status === 'failure' && (
        <div className="flex flex-wrap -m-4">
          <div className="text-red-500 pl-4 font-medium">{smartAppResult.error}</div>
        </div>
      )}
      {smartAppResult.status === 'loading' && (
        <div className="flex flex-wrap -m-4">
          <Spinner />
        </div>
      )}
      {smartAppResult.status === 'success' && (
        <form method="POST" onSubmit={onSubmit}>
          <div className="w-full mb-6">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
              {getIn(smartAppResult.data, ['smart', 'name'], smartAppResult.data.id)}
            </h1>
            <div className="h-1 w-20 bg-indigo-600 rounded"></div>
          </div>
          <div className="h-auto p-10 mb-5 w-2/3 bg-white flex flex-col space-y-5 hover:rotate-1 transition-transform">
            <div>
              <span className="font-bold pr-2">Client ID</span>
              <input
                className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                type="text"
                disabled={true}
                value={fields.id.value}
              />
            </div>
            <div>
              <span className="font-bold pr-2">Secret</span>
              <input
                className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                type="text"
                disabled={true}
                value={fields.secret.value}
              />
            </div>
          </div>
          <div className="h-auto p-10 w-2/3 bg-white flex flex-col space-y-5 hover:rotate-1 transition-transform">
            <h2 className="text-3xl font-medium title-font mb-2 text-gray-900">Edit Application</h2>
            <div>
              <div>
                <div>
                  <label className="font-medium title-font">Application Name</label>
                  <input
                    required
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    type="text"
                    value={fields.appName.value}
                    onChange={(e) => fields.appName.onChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-medium title-font">Client OAuth Type</label>
                  <select
                    required
                    class="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-t-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    value={fields.oauthType.value}
                    onChange={(e) => fields.oauthType.onChange(e.target.value)}
                  >
                    <option value="secret">Authorization Code + Secret</option>
                    <option value="pkce">Authorization Code + PKCE</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium title-font">Redirect URL</label>
                  <input
                    required
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    type="text"
                    value={fields.redirectUri.value}
                    onChange={(e) => fields.redirectUri.onChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-medium title-font">Launch URL</label>
                  <input
                    required
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    type="text"
                    value={fields.launchUri.value}
                    onChange={(e) => fields.launchUri.onChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-medium title-font">Logo URL</label>
                  <input
                    required
                    type="text"
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    value={fields.logoUrl.value}
                    onChange={(e) => fields.logoUrl.onChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-medium title-font">Organization/Company Name</label>
                  <input
                    required
                    type="text"
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    value={fields.orgName.value}
                    onChange={(e) => fields.orgName.onChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-medium title-font">Organization/Company Website URL</label>
                  <input
                    required
                    type="text"
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    value={fields.orgUrl.value}
                    onChange={(e) => fields.orgUrl.onChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-medium title-font">Privacy Policy URL</label>
                  <input
                    required
                    type="text"
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    value={fields.privacyUrl.value}
                    onChange={(e) => fields.privacyUrl.onChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-medium title-font">Terms of Service URL</label>
                  <input
                    required
                    type="text"
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    value={fields.tosUrl.value}
                    onChange={(e) => fields.tosUrl.onChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-medium title-font">Description</label>
                  <textarea
                    required
                    type="text"
                    className="block mt-2 mb-2 w-1/2 bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
                    value={fields.desc.value}
                    onChange={(e) => fields.desc.onChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2 items-baseline">
                <button
                  type="submit"
                  className="flex justify-center mt-5 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  Save
                </button>
                {updateStatus.status === 'failure' && (
                  <div className="flex flex-wrap justify-start pb-5 -m-4 w-full">
                    <div className="text-red-500 pl-4 font-medium">Something went wrong</div>
                  </div>
                )}
                {updateStatus.status === 'success' && (
                  <div className="flex flex-wrap justify-start pb-5 -m-4 w-full">
                    <div className="text-green-500 pl-4 font-medium">Successfully updated</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
