import pkg from "pg";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_9KhebU3LomyF@ep-damp-field-antj5ejj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

async function resetDb() {
  try {
    console.log("Dropping existing tables to avoid schema conflicts...");
    await pool.query("DROP TABLE IF EXISTS users CASCADE;");
    await pool.query("DROP TABLE IF EXISTS secrets CASCADE;");
    await pool.query("DROP TABLE IF EXISTS audit_logs CASCADE;");
    
    console.log("Creating EnvVault schema...");
    await pool.query(`
      CREATE TABLE users (
       id UUID PRIMARY KEY,
       email TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE secrets (
       id UUID PRIMARY KEY,
       key TEXT NOT NULL,
       value TEXT NOT NULL,
       description TEXT,
       environment TEXT,
       created_by UUID,
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE audit_logs (
       id UUID PRIMARY KEY,
       user_id UUID,
       action TEXT,
       secret_key TEXT,
       environment TEXT,
       timestamp TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("Seeding test user...");
    const id = uuidv4();
    const email = "admin@envvault.com";
    const passwordHash = await bcrypt.hash("admin123", 10);
    
    await pool.query("INSERT INTO users (id, email, password) VALUES ($1, $2, $3)", [id, email, passwordHash]);
    
    console.log("==== LOGIN CREDENTIALS ====");
    console.log("Email: admin@envvault.com");
    console.log("Password: admin123");
    console.log("===========================");
  } catch(e) {
    console.error("DB Reset Error:", e);
  } finally {
    pool.end();
  }
}

resetDb();
