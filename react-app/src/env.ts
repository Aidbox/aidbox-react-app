const processEnv = (typeof process && process.env) || {};

export const env = {
  PATIENT_SMART_BASE_URL: processEnv.REACT_APP_PATIENT_SMART_BASE_URL,
  FRONTEND_URL: processEnv.REACT_APP_FRONTEND_URL,
  isDev:
    (window as any).REACT_APP_NODE_ENV === 'development' ||
    processEnv.REACT_APP_NODE_ENV === 'development',
  AIDBOX_URL: (window as any).REACT_APP_AIDBOX_URL || processEnv.REACT_APP_AIDBOX_URL || '',
};
