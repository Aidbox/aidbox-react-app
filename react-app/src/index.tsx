import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import init from "./init";

const a = async () => {
  const aidboxInstance = await init();
  const userInfo = await aidboxInstance.getUserInfo();
  console.log(userInfo);
};

a();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
