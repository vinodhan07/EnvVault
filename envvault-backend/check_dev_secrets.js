import { pool } from "./src/db/db.js";
import dotenv from "dotenv";
dotenv.config();

async function checkSecrets() {
  try {
    const res = await pool.query("SELECT * FROM secrets WHERE environment='Development'");
    console.log("Secrets in Development:");
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSecrets();
