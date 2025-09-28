import logger from '#config/logger.js';
import { createUser, loginUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { jwttoken } from '#utils/jwt.js';
import { signupSchema, signInSchema } from '#validations/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const valResult = signupSchema.safeParse(req.body);

    if (!valResult.success)
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(valResult.error),
      });

    const { name, email, role, password } = valResult.data;

    const user = await createUser({ name, email, password, role });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    logger.info(`User signed up successfully ${email}`);
    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Sign-up error', error);
    if (error.message === 'User with this email already exists')
      return res.status(409).json({ error: 'Email already exists' });
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const valResult = signInSchema.safeParse(req.body);

    if (!valResult.success)
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(valResult.error),
      });

    const { email, password } = valResult.data;

    const user = await loginUser({ email, password });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    logger.info(`User signed in successfully ${email}`);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Sign-in error', error);
    if (error.message === 'Invalid credentials')
      return res.status(401).json({ error: 'Invalid email or password' });
    if (error.message === 'Login failed')
      return res.status(500).json({ error: 'Login failed. Please try again.' });
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');
    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Sign-out error', error);
    next(error);
  }
};
