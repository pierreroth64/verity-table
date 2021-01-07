module.exports = {
  rootDir: '../',
  transform: {
    '.ts': 'ts-jest',
  },
  testRegex: '/lib/.*\\.spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  globalSetup: './test/setup.ts',
  verbose: true,
  testEnvironment: 'node',
};
