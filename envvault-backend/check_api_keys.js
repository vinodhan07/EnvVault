import { pool } from "./src/db/db.js";
import dotenv from "dotenv";
dotenv.config();

async function checkApiKey() {
  const key = "envvault_sk_14978556a7c537b66d0393e132a264acecf66f24";
  try {
    const res = await pool.query("SELECT * FROM api_keys WHERE api_key=$1", [key]);
    console.log("Key found:", res.rows.length > 0);
    if (res.rows.length > 0) {
      console.log(JSON.stringify(res.rows[0], null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkApiKey();
