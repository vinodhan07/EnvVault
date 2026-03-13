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
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'pending',
        user_token TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add columns if they don't exist (for existing databases)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
          ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
          ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'pending';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='user_token') THEN
          ALTER TABLE users ADD COLUMN user_token TEXT UNIQUE;
        END IF;
      END $$;
    `);

    const res = await pool.query("SELECT * FROM users WHERE role='admin' LIMIT 1");
    if (res.rows.length > 0) {
      console.log("Found existing admin! Email:", res.rows[0].email);
      // Ensure existing admin is approved and has a token
      if (res.rows[0].status !== 'approved' || !res.rows[0].user_token) {
        const adminToken = `envvault_ut_${uuidv4().replace(/-/g, '')}`;
        await pool.query(
          "UPDATE users SET status='approved', user_token=$1 WHERE id=$2",
          [adminToken, res.rows[0].id]
        );
        console.log("Updated existing admin with approved status and token.");
      }
    } else {
      console.log("No admin found in the database. Creating admin account...");
      const id = uuidv4();
      const email = "admin@envvault.com";
      const passwordHash = await bcrypt.hash("admin123", 10);
      const adminToken = `envvault_ut_${uuidv4().replace(/-/g, '')}`;
      
      await pool.query(
        "INSERT INTO users (id, email, password, role, status, user_token) VALUES ($1, $2, $3, 'admin', 'approved', $4)",
        [id, email, passwordHash, adminToken]
      );
      console.log("==== ADMIN CREDENTIALS ====");
      console.log("Email: admin@envvault.com");
      console.log("Password: admin123");
      console.log("User Token:", adminToken);
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

      CREATE TABLE IF NOT EXISTS api_keys (
        id UUID PRIMARY KEY,
        project_name TEXT NOT NULL,
        api_key TEXT UNIQUE NOT NULL,
        environment TEXT NOT NULL,
        created_by UUID NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

  } catch(e) {
    console.error("Error connecting to DB:", e);
  } finally {
    pool.end();
  }
}

checkDb();
