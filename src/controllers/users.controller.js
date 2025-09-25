import logger from '#config/logger.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '#services/users.service.js';
import { formatValidationError } from '#utils/format.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error('Error retrieving users', error);
    next(error);
  }
};

/**
 * Get a single user by ID
 */
export const getUserByIdController = async (req, res, next) => {
  try {
    // Validate ID parameter
    const paramValidation = userIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramValidation.error),
      });
    }

    const { id } = paramValidation.data;
    const user = await getUserById(id);

    logger.info(`User retrieved: ${user.email}`);
    res.json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist',
      });
    }
    logger.error('Error retrieving user by ID', error);
    next(error);
  }
};

/**
 * Update a user by ID
 */
export const updateUserController = async (req, res, next) => {
  try {
    // Validate ID parameter
    const paramValidation = userIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramValidation.error),
      });
    }

    // Validate request body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const { id } = paramValidation.data;
    const updates = bodyValidation.data;
    const isOwner = req.user.id === id;
    const isAdmin = req.user.role === 'admin';

    // Authorization checks
    if (!isOwner && !isAdmin) {
      logger.warn(`Unauthorized update attempt by ${req.user.email} for user ${id}`);
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You can only update your own profile unless you are an admin',
      });
    }

    // Role change restriction - only admins can change roles
    if (updates.role && !isAdmin) {
      logger.warn(`Non-admin user ${req.user.email} attempted to change role`);
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Only administrators can change user roles',
      });
    }

    // Prevent users from changing their own role
    if (updates.role && isOwner && isAdmin) {
      logger.warn(`Admin user ${req.user.email} attempted to change their own role`);
      return res.status(403).json({
        error: 'Operation not allowed',
        message: 'You cannot change your own role',
      });
    }

    const updatedUser = await updateUser(id, updates);

    logger.info(`User updated successfully: ${updatedUser.email} by ${req.user.email}`);
    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist',
      });
    }
    if (error.message === 'Email already exists') {
      return res.status(409).json({
        error: 'Email conflict',
        message: 'This email address is already in use',
      });
    }
    logger.error('Error updating user', error);
    next(error);
  }
};

/**
 * Delete a user by ID
 */
export const deleteUserController = async (req, res, next) => {
  try {
    // Validate ID parameter
    const paramValidation = userIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramValidation.error),
      });
    }

    const { id } = paramValidation.data;
    const isOwner = req.user.id === id;
    const isAdmin = req.user.role === 'admin';

    // Authorization checks
    if (!isOwner && !isAdmin) {
      logger.warn(`Unauthorized delete attempt by ${req.user.email} for user ${id}`);
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You can only delete your own account unless you are an admin',
      });
    }

    // Prevent users from deleting their own account (security measure)
    if (isOwner) {
      logger.warn(`User ${req.user.email} attempted to delete their own account`);
      return res.status(403).json({
        error: 'Operation not allowed',
        message: 'You cannot delete your own account. Contact an administrator for account deletion.',
      });
    }

    const deletedUser = await deleteUser(id);

    logger.info(`User deleted successfully: ${deletedUser.email} by ${req.user.email}`);
    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: deletedUser.id,
        name: deletedUser.name,
        email: deletedUser.email,
        role: deletedUser.role,
      },
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist',
      });
    }
    logger.error('Error deleting user', error);
    next(error);
  }
};
