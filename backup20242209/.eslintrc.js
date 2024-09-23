module.exports = {
  'env': {
    'browser': true,
    'es6': false,
    "jquery": true
  },
  'extends': [
    'eslint:recommended',
    'plugin:es5/no-es2015'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2015,
  },
  'rules': {
    'es5/no-arrow-functions': 'error',
    'linebreak-style': 0,
    'global-require': 0,
    'eslint linebreak-style': [0, 'error', 'windows'],
  },
  'plugins': [
    'es5',
  ],
};
