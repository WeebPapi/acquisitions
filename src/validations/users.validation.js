import { z } from 'zod';

/**
 * Schema to validate user ID parameter
 */
export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a positive integer')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'ID must be greater than 0'),
});

/**
 * Schema to validate user update requests
 */
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(255, 'Name must not exceed 255 characters')
      .optional(),
    email: z
      .string()
      .email('Invalid email format')
      .max(255, 'Email must not exceed 255 characters')
      .trim()
      .toLowerCase()
      .optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password must not exceed 128 characters')
      .optional(),
    role: z
      .enum(['user', 'admin'], {
        errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
      })
      .optional(),
  })
  .refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  );
