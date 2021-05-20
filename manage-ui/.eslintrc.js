module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quote-props': 'off',
    'quotes': 'off',
    'no-unused-vars': 'off',
    'dot-notation': 'off',
    'comma-dangle': 'off',
    'semi': 'off',
    'no-return-assign': 'off',
    'eqeqeq': 'off',
    'no-sequences': 'off',
    'lines-between-class-members': 'off',
    'camelcase': 'off',
    'no-useless-escape': 'off',
    'no-void': 'off',
    'no-self-compare': 'off'
  }
}
