// Sample test file to verify Jest configuration
import { formatValidationError } from '#utils/format.js';

describe('Sample Tests', () => {
  test('should verify Jest is working', () => {
    expect(1 + 1).toBe(2);
  });

  test('should verify module imports work', () => {
    const mockError = {
      issues: [
        { message: 'Test error 1' },
        { message: 'Test error 2' }
      ]
    };

    const result = formatValidationError(mockError);
    expect(result).toBe('Test error 1,Test error 2');
  });

  test('should verify environment variables are set', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test-jwt-secret-key-for-testing');
  });
});

describe('Utility Functions', () => {
  describe('formatValidationError', () => {
    test('should format validation errors correctly', () => {
      const error = {
        issues: [
          { message: 'Name is required' },
          { message: 'Email must be valid' }
        ]
      };

      const result = formatValidationError(error);
      expect(result).toBe('Name is required,Email must be valid');
    });

    test('should handle empty errors', () => {
      const result = formatValidationError(null);
      expect(result).toBe('Validation failed');
    });

    test('should handle errors without issues', () => {
      const error = { someOtherProperty: 'value' };
      const result = formatValidationError(error);
      expect(result).toBe('Validation failed');
    });
  });
});