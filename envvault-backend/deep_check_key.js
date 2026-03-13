import { pool } from "./src/db/db.js";
import dotenv from "dotenv";
import fs from 'fs';
dotenv.config();

async function deepCheck() {
  try {
    const res = await pool.query("SELECT api_key FROM api_keys WHERE project_name='demo'");
    fs.writeFileSync('full_key.txt', res.rows[0].api_key);
    console.log("Full key written to full_key.txt");
    
    const targetKey = "envvault_sk_01c9b83b40d4f40f065cc0a8ed988fe7214";
    console.log(`Target Key: '${targetKey}', Len: ${targetKey.length}`);
    
    const match = await pool.query("SELECT * FROM api_keys WHERE api_key = $1", [targetKey]);
    console.log("Direct Query Match:", match.rows.length > 0);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

deepCheck();
