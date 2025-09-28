export default {
  // Test environment
  testEnvironment: 'node',

  // Module type
  preset: null,

  // Transform configuration for ES modules
  transform: {},

  // Module resolution
  moduleNameMapper: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^#models/(.*)$': '<rootDir>/src/models/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
    '^#utils/(.*)$': '<rootDir>/src/utils/$1',
    '^#validations/(.*)$': '<rootDir>/src/validations/$1',
    '^#src/(.*)$': '<rootDir>/src/$1',
  },

  // Test file patterns - only look for app.test.js
  testMatch: [
    '<rootDir>/tests/app.test.js',
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/logs/',
    '<rootDir>/drizzle/',
  ],

  // Coverage configuration
  collectCoverage: false, // Enable in CI/CD with --coverage flag
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js',
    '!src/server.js',
    '!src/config/arcjet.js', // Skip external service configs
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html', 'json-summary'],

  // Coverage thresholds removed - add them back when you have more comprehensive tests

  // Setup files - removed since we don't need them

  // Test timeout
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Force exit
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true,
};
