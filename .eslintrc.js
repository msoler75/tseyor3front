module.exports = {
    env: {
      es6: true,
      browser: true,
      es2021: true,
    },
    extends: ['airbnb-base', 'prettier',
    'plugin:vue/essential'],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': 'error',
    },
    plugins: ['prettier'],
  };