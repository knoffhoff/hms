export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/repository/domain/.*-maker.ts',
    '<rootDir>/__tests__/repository/dynamo-db-mock.ts',
    '<rootDir>/__tests__/util/date-mock.ts',
    '<rootDir>/__tests__/util/uuids-mock.ts',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/__tests__/',
    '<rootDir>/node_modules/',
  ],
};
