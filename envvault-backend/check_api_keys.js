import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_9KhebU3LomyF@ep-damp-field-antj5ejj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'api_keys' ORDER BY ordinal_position");
    console.log("api_keys COLUMNS:");
    cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    pool.end();
  }
}

check();
