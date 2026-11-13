import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ quiet: true });

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Opens a database connection and confirms PostgreSQL answers.
export async function connectDatabase() {
  
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}

export default pool; 
