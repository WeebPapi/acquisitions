import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '#services/auth.service.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (error) {
    logger.error('Error getting all users', error);
    throw new Error(error);
  }
};

/**
 * Get a user by ID
 * @param {number} id - User ID
 * @returns {Object} User object without password
 */
export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    logger.debug(`Retrieved user: ${user.email}`);
    return user;
  } catch (error) {
    if (error.message === 'User not found') {
      throw error;
    }
    logger.error('Error getting user by ID', error);
    throw new Error('Error retrieving user');
  }
};

/**
 * Update a user by ID
 * @param {number} id - User ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated user object
 */
export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) throw new Error('User does not exist');

    // Prepare update object
    const updateData = { ...updates };

    // Hash password if provided
    if (updates.password) {
      updateData.password = await hashPassword(updates.password);
    }

    // Check if email is already taken by another user
    if (updates.email) {
      const [emailExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, updates.email))
        .limit(1);

      if (emailExists && emailExists.id !== id) {
        throw new Error('Email already exists');
      }
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date();

    // Perform update
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    if (!updatedUser) {
      throw new Error('User update failed');
    }

    logger.info(`User updated successfully: ${updatedUser.email}`);
    return updatedUser;
  } catch (error) {
    if (
      error.message === 'User not found' ||
      error.message === 'Email already exists'
    ) {
      throw error;
    }
    logger.error('Error updating user', error);
    throw new Error('Error updating user');
  }
};

/**
 * Delete a user by ID
 * @param {number} id - User ID
 * @returns {Object} Deleted user information
 */
export const deleteUser = async id => {
  try {
    // Check if user exists before deletion
    const existingUser = await getUserById(id);
    if (!existingUser) throw new Error('User does not exist');

    // Perform deletion
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    if (!deletedUser) {
      throw new Error('User deletion failed');
    }

    logger.info(`User deleted successfully: ${deletedUser.email}`);
    return deletedUser;
  } catch (error) {
    if (error.message === 'User not found') {
      throw error;
    }
    logger.error('Error deleting user', error);
    throw new Error('Error deleting user');
  }
};
