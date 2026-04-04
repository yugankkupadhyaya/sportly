import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
