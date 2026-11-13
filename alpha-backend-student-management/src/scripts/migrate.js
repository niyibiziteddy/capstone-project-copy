import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { migrate } from "postgres-migrations";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();

    console.log("PostgreSQL connection successful!");
    console.log(`Database: ${process.env.DB_NAME}`);

    await migrate(
      { client },
      path.join(__dirname, "../migrations"),
    );

    console.log("Database migrations completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

runMigrations(); 
