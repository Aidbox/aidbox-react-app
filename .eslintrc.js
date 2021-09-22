module.exports = {
    env: {
        'jest/globals': true,
        browser: true,
    },
    root: true,
    extends: ['prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'jest', 'import'],
    globals: {
        JSX: true,
    },
    rules: {
        'react-native/no-inline-styles': 0,
        'prettier/prettier': 0,
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', ['index', 'sibling', 'parent']],
                'newlines-between': 'always',
                pathGroupsExcludedImportTypes: ['builtin'],
                pathGroups: [
                    {
                        pattern: 'shared/**',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: 'src/**',
                        group: 'internal',
                        position: 'after',
                    },
                ],
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
    },
};
