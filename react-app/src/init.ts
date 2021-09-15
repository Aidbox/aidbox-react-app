import Aidbox, { Types } from "@aidbox/client-sdk-js";
import { env } from "./env";

const init = async () => {
  console.log(env);
  const credentials = {
    URL: env.URL,
    CLIENT_ID: env.CLIENT,
    CLIENT_SECRET: env.SECRET,
    AUTH_MODE: env.AUTH_MODE,
    FHIR_STRICT: env.FHIR_STRICT,
  };

  const storage = {
    insertIntoStorage: localStorage.setItem.bind(localStorage),
    obtainFromStorage: localStorage.getItem.bind(localStorage),
    removeFromStorage: localStorage.removeItem.bind(localStorage),
  };

  const instance = Aidbox.initializeInstance(
    credentials,
    storage
  ) as Types.TPublicAPI;

  await instance.authorize({
    username: env.ADMIN_ID,
    password: env.ADMIN_PASSWORD,
  });

  return instance;
};

export default init;
