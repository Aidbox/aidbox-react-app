import { useGate, useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import Spinner from '../../../components/Spinner';
import * as smartAppModel from '../model/smartApp.js';

export const SmartAppForm = () => {
  const { id } = useParams();
  useGate(smartAppModel.SmartAppFormGate, id);
  const smartAppResult = useStore(smartAppModel.$smartApp);

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
              Smart App Name
            </h1>
            <div className="h-1 w-20 bg-indigo-600 rounded"></div>
          </div>
          <div className="h-auto py-20 px-10 mb-5 w-2/3 bg-white flex flex-col space-y-5 hover:rotate-1 transition-transform">
            <div>
              <div>
                <span className="font-bold pr-2">Client ID:</span>
                <span></span>
              </div>
              <div>
                <span className="font-bold pr-2">Secret:</span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="h-auto py-20 px-10 w-2/3 bg-white flex flex-col space-y-5 hover:rotate-1 transition-transform">
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
                      id="_app_vendor_apps_view_db_form_smart_name"
                      className="anti_input-50-7"
                      defaultValue="My New SMART App"
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Client OAuth Type</label>
                  <div className="anti_alt-select-55-7 app_vendor_apps_view-221-19">
                    <div className="anti_alt-select-119-7 app_vendor_apps_view-231-49">
                      Authorization Code + Secret
                    </div>
                    <input
                      autoComplete="off"
                      autoCapitalize="none"
                      name={1}
                      id="_app_vendor_apps_view_db_form_auth_authorization_code_client_type"
                      className="anti_alt-select-135-7 anti_alt-select-515-54"
                      spellCheck="false"
                      autoCorrect="off"
                      defaultValue
                    />
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
                      id="_app_vendor_apps_view_db_form_auth_authorization_code_redirect_uri"
                      className="anti_input-50-7"
                      defaultValue="http://localhost"
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Launch URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      id="_app_vendor_apps_view_db_form_smart_launch_url"
                      className="anti_input-50-7"
                      defaultValue
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Logo URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      id="_app_vendor_apps_view_db_form_smart_logo_url"
                      className="anti_input-50-7"
                      defaultValue
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Organization/Company Name</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      id="_app_vendor_apps_view_db_form_smart_organization_name"
                      className="anti_input-50-7"
                      defaultValue
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
                      id="_app_vendor_apps_view_db_form_smart_organization_url"
                      className="anti_input-50-7"
                      defaultValue
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Privacy Policy URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      id="_app_vendor_apps_view_db_form_smart_policy_url"
                      className="anti_input-50-7"
                      defaultValue
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Terms of Service URL</label>
                  <div className="anti_input-12-7 app_vendor_apps_view-221-19">
                    <input
                      type="text"
                      id="_app_vendor_apps_view_db_form_smart_tos_url"
                      className="anti_input-50-7"
                      defaultValue
                    />
                  </div>
                </div>
                <div>
                  <label className="app_vendor_apps_view-220-19">Description</label>
                  <div className="anti_textarea-11-7 app_vendor_apps_view-221-19">
                    <textarea
                      type="text"
                      id="_app_vendor_apps_view_db_form_smart_description"
                      className="anti_textarea-48-7"
                      defaultValue={''}
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
