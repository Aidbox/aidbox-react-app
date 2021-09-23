/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { useBabelRc, override, babelInclude } = require('customize-cra');

const supportMjs = () => (webpackConfig) => {
    webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
    });
    return webpackConfig;
};

const patchInclude = () => (webpackConfig) => {
    return babelInclude([path.resolve('src'), path.resolve('../shared/src')])(webpackConfig);
};

module.exports = override(supportMjs(), useBabelRc(), patchInclude());
