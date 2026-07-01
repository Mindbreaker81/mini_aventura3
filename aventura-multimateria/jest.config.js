const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/app/world/**/use*Store.ts',
    'src/app/world/shared/**/*.ts',
    'src/app/hooks/useGameSession.ts',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      lines: 62,
      statements: 62,
      functions: 55,
      branches: 50,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
