module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: [
    'standard',
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'p5js',
    'p5js/sound',
  ],
  rules: {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'array-callback-return': 'error',
    'no-undef': 'error',
    'quote-props': ['error', 'consistent'],
    'no-unused-vars': 'error',
    'space-before-function-paren': ['error', {
      named: 'never',
      anonymous: 'always',
      asyncArrow: 'always',
    }],
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-nocheck': 'allow-with-description' }],
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    '@typescript-eslint/no-var-requires': 'off',
  },
  globals: {
    'p5': 'writeable',
  },
};
