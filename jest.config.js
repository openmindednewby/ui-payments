/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom/$1',
    '^react-native-web$': '<rootDir>/node_modules/react-native-web',
    '^react-native-web/(.*)$': '<rootDir>/node_modules/react-native-web/$1',
  },
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.d.ts', '!src/index.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: { '^.+\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }] },
};
