const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
    {
        ignores: ['lib/', 'node_modules/'],
    },
    ...tseslint.configs['flat/recommended'],
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            sourceType: 'module',
        },
    },
];

