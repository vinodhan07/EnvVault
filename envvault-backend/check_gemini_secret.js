import { pool } from "./src/db/db.js";
import dotenv from "dotenv";
dotenv.config();

async function checkGeminiSecret() {
  try {
    const res = await pool.query("SELECT key FROM secrets WHERE environment='Development' AND key='GEMINI_API'");
    console.log('Found:', res.rows.length > 0);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkGeminiSecret();
