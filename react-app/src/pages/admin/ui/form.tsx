import { StoreValue } from 'effector';

import { useGate, useStore } from 'effector-react';
import { useForm } from 'effector-forms';
import * as newPatient from '../model';

const Form = () => {
  useGate(newPatient.FormGate);
  const status = useStore(newPatient.$submitStatus);
  console.log(status.success);

  const { fields } = useForm(newPatient.form);

  const onSubmit = (e: any) => {
    e.preventDefault();
    newPatient.submitForm();
  };

  return (
    <div className="min-h-screen flex bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="border-b-4 border-indigo-500 rounded">
          <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
            New Patient
          </h1>
        </div>
        <div className="text-red-500">{status.fail && status.message}</div>
        <div className="text-green-500">{status.success && status.message}</div>
        <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={onSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address">Email address</label>
              <input
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 mb-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={fields.email.value}
                onChange={(e) => fields.email.onChange(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={fields.password.value}
                onChange={(e) => fields.password.onChange(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
