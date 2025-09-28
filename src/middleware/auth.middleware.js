import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

/**
 * Authentication middleware to verify JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No authentication token provided',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;

    logger.debug(`User authenticated: ${decoded.email} (${decoded.role})`);
    next();
  } catch (error) {
    logger.error('Authentication error', error);
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Authorization middleware to check user roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by ${req.user.email} (${req.user.role})`
      );
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Access denied for this role',
      });
    }

    next();
  };
};

/**
 * Middleware to check if user can access their own data or is admin
 */
export const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'User must be authenticated',
    });
  }

  const userId = parseInt(req.params.id);
  const isOwner = req.user.id === userId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    logger.warn(
      `Unauthorized access attempt by ${req.user.email} to user ${userId}`
    );
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'You can only access your own data unless you are an admin',
    });
  }

  req.isOwner = isOwner;
  req.isAdmin = isAdmin;
  next();
};
