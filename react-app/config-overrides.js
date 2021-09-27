/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { useBabelRc, override, babelInclude } = require('customize-cra');

const patchInclude = () => (webpackConfig) => {
  return babelInclude([path.resolve('src'), path.resolve('../shared/src')])(webpackConfig);
};

module.exports = override(useBabelRc(), patchInclude());
