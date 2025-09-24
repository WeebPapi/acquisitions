import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing the password', error);
    throw new Error('Error hashing');
  }
};
export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0)
      throw new Error('User with this email already exists');

    const password_hash = await hashPassword(password);
    console.log('Hashed pass', password_hash);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: password_hash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });
    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (error) {
    console.log(error);
    logger.error('Error creating user', error);
    if (error.message === 'User with this email already exists') {
      throw error;
    }
    throw new Error('Error creating user');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing passwords', error);
    throw new Error('Error comparing passwords');
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Return user without password
    // eslint-disable-next-line
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User ${user.email} logged in successfully`);
    return userWithoutPassword;
  } catch (error) {
    logger.error('Error during login', error);
    if (error.message === 'Invalid credentials') {
      throw error;
    }
    throw new Error('Login failed');
  }
};
