module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'semi': 'off',
    'quote-props': 'off',
    'arrow-parens': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'no-unused-vars': 'off',
    'vue/attributes-order': 'off',
    'vue/html-self-closing': 'off',
    'quotes': 'off',
    'dot-notation': 'off',
    'comma-dangle': 'off',
    'no-return-assign': 'off',
    'eqeqeq': 'off',
    'no-sequences': 'off',
    'lines-between-class-members': 'off',
    'camelcase': 'off',
    'no-useless-escape': 'off',
    'no-void': 'off',
    'no-self-compare': 'off',
    'computed-property-spacing': 'off',
    'vue/valid-v-for': 'off',
    'vue/require-default-prop': 'off',
    'vue/component-definition-name-casing': 'off',
    'object-shorthand': 'off',
    'vue/no-unused-components': 'off',
    'vue/max-attributes-per-line': 'off',
    'prefer-promise-reject-errors': 'off'
  }
}
