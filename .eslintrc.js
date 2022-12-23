module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: ['react-hooks'],
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    indent: 'off',
    '@typescript-eslint/no-empty-interface': [
      'warn',
      { allowSingleExtends: false },
    ],
    'react/prop-types': [2, { ignore: ['children'] }],
    '@typescript-eslint/explicit-function-return-type': ['off'], // 代码迁移，暂时关闭，后续代码优化时开启
    '@typescript-eslint/no-explicit-any': ['off'], // 代码迁移，暂时关闭，后续代码优化时开启
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
}
