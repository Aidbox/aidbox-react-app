import { useForm } from 'effector-forms';
import { useGate, useStore } from 'effector-react';
import * as vendor from '../model/enrollment.js';

export const SignupForm = () => {
  useGate(vendor.FormGate);
  const { fields } = useForm(vendor.form);
  const enrollStatus = useStore(vendor.$enrollStatus);

  const onSubmit = (e) => {
    e.preventDefault();
    vendor.submitForm();
  };

  return (
    <div className="h-auto p-10 w-full bg-white flex flex-col justify-center space-y-5 hover:rotate-1 transition-transform">
      <div className="w-full mb-6 lg:mb-0 flex justify-center">
        <h1 className="text-3xl font-medium title-font mb-2 text-gray-900">
          Vendor Registration for Sandbox
        </h1>
      </div>
      <div className="flex flex-col items-center">
        <form className="w-1/3" method="POST" onSubmit={onSubmit}>
          {enrollStatus.status === 'failure' && (
            <div className="flex flex-wrap justify-start pb-5 -m-4 w-full">
              <div className="text-red-500 pl-4 font-medium">Something went wrong</div>
            </div>
          )}
          <div>
            <label className="font-medium title-font">First Name</label>
            <input
              required
              className="block mt-2 mb-2 w-full bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
              type="text"
              value={fields.firstName.value}
              onChange={(e) => fields.firstName.onChange(e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium title-font">Last Name</label>
            <input
              required
              className="block mt-2 mb-2 w-full bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
              type="text"
              value={fields.lastName.value}
              onChange={(e) => fields.lastName.onChange(e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium title-font">Email</label>
            <input
              required
              className="block mt-2 mb-2 w-full bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
              type="email"
              value={fields.email.value}
              onChange={(e) => fields.email.onChange(e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium title-font">Organization Name</label>
            <input
              required
              type="text"
              className="block mt-2 mb-2 w-full bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
              value={fields.orgName.value}
              onChange={(e) => fields.orgName.onChange(e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium title-font">Password</label>
            <input
              required
              type="password"
              className="block mt-2 mb-2 w-full bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600"
              value={fields.password.value}
              onChange={(e) => fields.password.onChange(e.target.value)}
            />
          </div>
          <div className="flex justify-start w-full">
            <button
              type="submit"
              className="flex justify-center mt-5 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
