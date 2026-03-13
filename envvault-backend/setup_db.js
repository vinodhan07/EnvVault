import pkg from "pg";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_9KhebU3LomyF@ep-damp-field-antj5ejj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

async function checkDb() {
  try {
    // Ensure the table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const res = await pool.query("SELECT * FROM users LIMIT 1");
    if (res.rows.length > 0) {
      console.log("Found existing user! Email:", res.rows[0].email);
      console.log("Note: password is encrypted. If you don't remember it, we can create a new one.");
    } else {
      console.log("No users found in the database. Creating a test account...");
      const id = uuidv4();
      const email = "admin@cybervault.com";
      const passwordHash = await bcrypt.hash("admin123", 10);
      
      await pool.query("INSERT INTO users (id, email, password) VALUES ($1, $2, $3)", [id, email, passwordHash]);
      console.log("==== LOGIN CREDENTIALS ====");
      console.log("Email: admin@cybervault.com");
      console.log("Password: admin123");
      console.log("===========================");
    }

    // Checking if other tables exist just to be safe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS secrets (
       id UUID PRIMARY KEY,
       key TEXT NOT NULL,
       value TEXT NOT NULL,
       description TEXT,
       environment TEXT,
       created_by UUID,
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS audit_logs (
       id UUID PRIMARY KEY,
       user_id UUID,
       action TEXT,
       secret_key TEXT,
       environment TEXT,
       timestamp TIMESTAMP DEFAULT NOW()
      );
    `);

  } catch(e) {
    console.error("Error connecting to DB:", e);
  } finally {
    pool.end();
  }
}

checkDb();
