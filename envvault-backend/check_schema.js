import pkg from "pg";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_9KhebU3LomyF@ep-damp-field-antj5ejj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

async function checkDb() {
  try {
    const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users';");
    console.log("COLUMNS:", cols.rows.map(r => r.column_name));
    
    // Check users
    const res = await pool.query("SELECT * FROM users");
    console.log("USERS:", res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

checkDb();
