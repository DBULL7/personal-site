const nextVitals = require('eslint-config-next/core-web-vitals')
const prettier = require('eslint-config-prettier')

module.exports = [
  ...nextVitals,
  prettier,
  { ignores: ['.contentlayer/**', 'node_modules/**'] }
]
