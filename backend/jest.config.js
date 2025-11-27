module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/seeders/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
