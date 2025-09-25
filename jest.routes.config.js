module.exports = {
  roots: ['<rootDir>/src/test/integration/routes'],
  testRegex: '(/src/test/integration/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
