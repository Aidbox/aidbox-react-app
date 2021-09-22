/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-extraneous-dependencies */
const { useBabelRc, override } = require('customize-cra');

const supportMjs = () => (webpackConfig) => {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
  });
  return webpackConfig;
  // {
  // "plugins": [["effector/babel-plugin", { "addLoc": true }]]
  // }
};

module.exports = override(supportMjs(), useBabelRc());
