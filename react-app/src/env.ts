const processEnv = (typeof process && process.env) || {};

export const env = {
  PATIENT_SMART_BASE_URL: processEnv.REACT_APP_PATIENT_SMART_BASE_URL,
  FRONTEND_URL: processEnv.REACT_APP_FRONTEND_URL,
  isDev:
    (window as any).REACT_APP_NODE_ENV === 'development' ||
    processEnv.REACT_APP_NODE_ENV === 'development',
  AIDBOX_URL: (window as any).REACT_APP_AIDBOX_URL || processEnv.REACT_APP_AIDBOX_URL || '',
  CLIENT: (window as any).REACT_APP_CLIENT_ID || process.env.REACT_APP_CLIENT_ID || '',
  SECRET: (window as any).REACT_APP_CLIENT_SECRET || process.env.REACT_APP_CLIENT_SECRET || '',
  AUTH_MODE: (window as any).REACT_APP_AUTH_MODE || process.env.REACT_APP_AUTH_MODE || '',
  FHIR_STRICT:
    (window as any).REACT_APP_FHIR_STRICT === 'true' ||
    process.env.REACT_APP_FHIR_STRICT === 'true' ||
    false,
};
