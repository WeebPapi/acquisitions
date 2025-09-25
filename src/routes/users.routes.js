import {
  getUsers,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from '#controllers/users.controller.js';
import { authenticate, authorize, authorizeOwnerOrAdmin } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/users - Get all users (admin only)
router.get('/', authorize('admin'), getUsers);

// GET /api/users/:id - Get user by ID (owner or admin)
router.get('/:id', authorizeOwnerOrAdmin, getUserByIdController);

// PUT /api/users/:id - Update user by ID (owner or admin, with role restrictions)
router.put('/:id', updateUserController);

// DELETE /api/users/:id - Delete user by ID (admin only)
router.delete('/:id', authorize('admin'), deleteUserController);

export default router;
