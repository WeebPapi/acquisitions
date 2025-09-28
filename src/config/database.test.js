import 'dotenv/config';
import { drizzle } from 'drizzle-orm/pg-js';
import pg from 'pg';

const { Pool } = pg;

// Create connection pool for testing
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create Drizzle instance with pg driver
const db = drizzle(pool);

export { db, pool };
