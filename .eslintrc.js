const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  env: {
    es2021: true,
    node: true,
    mocha: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': OFF,
    '@typescript-eslint/ban-ts-ignore': OFF,
    '@typescript-eslint/camelcase': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/no-explicit-any': ERROR,
    'import/no-named-as-default': OFF,
    'import/no-named-as-default-member': OFF,
    'no-console': process.env.NODE_ENV === 'development' ? OFF : ERROR,
    'prettier/prettier': [ERROR, { singleQuote: true }],
  },
};
