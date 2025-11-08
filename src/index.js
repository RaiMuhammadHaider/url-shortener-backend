import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';

// export const db = drizzle(process.env.DATABASE_URL);

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);


