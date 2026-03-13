import { pool } from "./src/db/db.js";
import dotenv from "dotenv";
dotenv.config();

async function listApiKeys() {
  try {
    const res = await pool.query("SELECT project_name, api_key, environment FROM api_keys");
    console.log("Existing API Keys:");
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listApiKeys();
