import { pool } from "./src/db/db.js";
import dotenv from "dotenv";
dotenv.config();

async function getToken() {
  try {
    const res = await pool.query("SELECT user_token FROM users WHERE email='admin@envvault.com'");
    console.log(res.rows[0].user_token);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

getToken();
