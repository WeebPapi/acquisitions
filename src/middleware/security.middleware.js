import logger from '#config/logger.js';

// Simple security middleware without external dependencies
export const securityMiddleware = async (req, res, next) => {
  try {
    // Basic security headers and checks can be added here
    // For now, we'll just pass through and let other middleware handle security
    
    // Log request for monitoring
    logger.debug(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      role: req.user?.role || 'guest'
    });
    
    next();
  } catch (error) {
    logger.error('Security middleware error', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Security check failed',
    });
  }
};
