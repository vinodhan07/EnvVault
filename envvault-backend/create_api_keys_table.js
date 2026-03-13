import pkg from "pg";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_9KhebU3LomyF@ep-damp-field-antj5ejj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

async function createApiKeysTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id UUID PRIMARY KEY,
        project_name TEXT NOT NULL,
        api_key TEXT UNIQUE NOT NULL,
        environment TEXT NOT NULL,
        created_by UUID,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ api_keys table created successfully!");
  } catch(e) {
    console.error("Error:", e);
  } finally {
    pool.end();
  }
}

createApiKeysTable();
