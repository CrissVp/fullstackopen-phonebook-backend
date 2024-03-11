module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true
  },
  'plugins': [
    '@stylistic/js'
  ],
  'extends': 'eslint:recommended',
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'eqeqeq': 'error',
    'no-console': 0,
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    '@stylistic/js/indent': [
      'error',
      2
    ],
    '@stylistic/js/linebreak-style': [
      'error',
      'windows'
    ],
    '@stylistic/js/quotes': [
      'error',
      'single'
    ],
    '@stylistic/js/semi': [
      'error',
      'always',
      { 'omitLastInOneLineBlock': true }
    ],
  }
};
