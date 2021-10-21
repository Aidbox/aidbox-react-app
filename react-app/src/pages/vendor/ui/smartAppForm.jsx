import { useGate, useStore } from 'effector-react';
import { useForm } from 'effector-forms';
import { useParams } from 'react-router-dom';
import { getIn } from '../../../lib/tools';
import Spinner from '../../../components/Spinner';
import * as vendor from '../model/smartApp.js';

export const SmartAppForm = () => {
  useGate(vendor.FormGate);
  const { id } = useParams();
  useGate(vendor.SmartAppFormGate, id);
  const smartAppResult = useStore(vendor.$smartApp);
  const { fields } = useForm(vendor.form);

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
        <>
          <div className="w-full mb-6">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
              {getIn(smartAppResult.data, ['smart', 'name'], smartAppResult.data.id)}
            </h1>
            <div className="h-1 w-20 bg-indigo-600 rounded"></div>
          </div>
          <div
            className="py-10"
            /* className="h-auto py-20 px-10 mb-5 w-2/3 bg-white flex flex-col space-y-5 hover:rotate-1 transition-transform" */
          >
            <div>
              <div>Client ID:</div>
              <input type="text" disabled={true} value={fields.id.value} />
            </div>
            <div>
              <div>Secret:</div>
              <input type="text" disabled={true} value={fields.secret.value} />
            </div>
          </div>
          <div
          /* className="h-auto py-20 px-10 w-2/3 bg-white flex flex-col space-y-5 hover:rotate-1 transition-transform" */
          >
            <div className="anti_card-14-21">
              <div className="anti_card-23-24">Edit Application</div>
            </div>
            <div>
              <div className="app_vendor_apps_view-223-20">
                <div>
                  <label className="app_vendor_apps_view-220-19">Application Name</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      value={fields.appName.value}
                      onChange={(e) => fields.appName.onChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Client OAuth Type</label>
                  <div className="anti_alt-select-55-7 app_vendor_apps_view-221-19">
                    <div className="anti_alt-select-119-7 app_vendor_apps_view-231-49">
                      Authorization Code + Secret
                    </div>
                    <input type="text" value={fields.oauthType.value} />
                    <div className="anti_alt-select-85-7">
                      <i className="far fa-chevron-down anti_alt-select-543-49" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Redirect URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      value={fields.redirectUri.value}
                      onChange={(e) => fields.redirectUri.onChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Launch URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      value={fields.launchUri.value}
                      onChange={(e) => fields.launchUri.onChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Logo URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input type="text" value={fields.logoUrl.value} />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Organization/Company Name</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      value={fields.orgName.value}
                      onChange={(e) => fields.orgName.onChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">
                    Organization/Company Website URL
                  </label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      value={fields.orgUrl.value}
                      onChange={(e) => fields.orgUrl.onChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Privacy Policy URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      value={fields.privacyUrl.value}
                      onChange={(e) => fields.privacyUrl.onChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Terms of Service URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      value={fields.tosUrl.value}
                      onChange={(e) => fields.tosUrl.onChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Description</label>
                  <div className="anti_textarea-11-7 app_vendor_apps_view-221-19">
                    <textarea
                      type="text"
                      value={fields.desc.value}
                      onChange={(e) => fields.desc.onChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="app_vendor_apps_view-268-20">
                <button className="anti_button-10-3 hp-primary-btn app_vendor_apps_view-269-38">
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
