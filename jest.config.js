export default {
  // Test environment
  testEnvironment: 'node',
  
  // Module type
  preset: null,
  extensionsToTreatAsEsm: ['.js'],
  
  // Transform configuration for ES modules
  transform: {},
  
  // Module resolution
  moduleNameMapping: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^#models/(.*)$': '<rootDir>/src/models/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
    '^#utils/(.*)$': '<rootDir>/src/utils/$1',
    '^#validations/(.*)$': '<rootDir>/src/validations/$1',
    '^#src/(.*)$': '<rootDir>/src/$1'
  },

  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/__tests__/**/*.js'
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/logs/',
    '<rootDir>/drizzle/'
  ],

  // Coverage configuration
  collectCoverage: false, // Enable in CI/CD with --coverage flag
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js',
    '!src/server.js',
    '!src/config/arcjet.js' // Skip external service configs
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json-summary'
  ],
  
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test timeout
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,
  
  // Verbose output
  verbose: true,

  // Force exit
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true
};