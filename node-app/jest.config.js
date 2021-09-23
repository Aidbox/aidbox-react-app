// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    preset: 'ts-jest',

    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // The test environment that will be used for testing
    testEnvironment: 'node',

    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],

    transformIgnorePatterns: ['node_modules/(?!(axios))'],

    setupFilesAfterEnv: ['./tests/setup.ts'],
};
