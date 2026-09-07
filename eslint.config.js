const nextVitals = require('eslint-config-next/core-web-vitals')
const prettier = require('eslint-config-prettier/flat')

module.exports = [
  { ignores: ['.contentlayer/**', '.pi/**'] },
  ...nextVitals,
  prettier
]
