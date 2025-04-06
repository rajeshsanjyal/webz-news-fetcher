module.exports = {
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/*.test.ts']
};