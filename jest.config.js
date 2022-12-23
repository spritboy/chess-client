const config = {
  rootDir: './',
  roots: ['<rootDir>/__test__'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  transform: {
    // '^.+\.vue$': '@vue/vue3-jest',
    '\\.[jt]sx?$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.[jt]s?(x)', '!**/node_modules/**'],
}

module.exports = config
