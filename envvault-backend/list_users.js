import { pool } from "./src/db/db.js";
import dotenv from "dotenv";
dotenv.config();

async function listUsers() {
  try {
    const res = await pool.query("SELECT email, role, status, user_token FROM users");
    console.log("All Users in DB:");
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Query Error:", err);
    process.exit(1);
  }
}

listUsers();
