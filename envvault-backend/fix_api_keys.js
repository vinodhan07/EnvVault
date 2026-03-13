import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_9KhebU3LomyF@ep-damp-field-antj5ejj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

async function fix() {
  try {
    console.log("Dropping old Infisical api_keys table...");
    await pool.query("DROP TABLE IF EXISTS api_keys CASCADE;");
    
    console.log("Creating EnvVault api_keys table...");
    await pool.query(`
      CREATE TABLE api_keys (
        id UUID PRIMARY KEY,
        project_name TEXT NOT NULL,
        api_key TEXT UNIQUE NOT NULL,
        environment TEXT NOT NULL,
        created_by UUID,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("✅ api_keys table recreated with correct schema!");
    
    // Verify
    const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'api_keys' ORDER BY ordinal_position");
    console.log("Columns:", cols.rows.map(r => r.column_name));
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    pool.end();
  }
}

fix();
