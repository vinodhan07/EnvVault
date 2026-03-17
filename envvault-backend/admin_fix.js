import { pool } from "./src/db/db.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

async function checkAdmin() {
  try {
    const res = await pool.query("SELECT email, role, status, user_token FROM users WHERE email='admin@envvault.com'");
    if (res.rows.length > 0) {
      const user = res.rows[0];
      console.log("Current Admin Data:", JSON.stringify(user, null, 2));
      
      const newPasswordHash = await bcrypt.hash("password123", 10);
      const userToken = user.user_token || `envvault_ut_${uuidv4().replace(/-/g, '')}`;

      process.stdout.write("Fixing admin credentials, role, status and token... ");
      await pool.query(
        "UPDATE users SET password=$1, status='approved', role='admin', user_token=$2 WHERE email='admin@envvault.com'",
        [newPasswordHash, userToken]
      );
      console.log("Done.");
      console.log("Login with: admin@envvault.com / password123");
    } else {
      console.log("Admin user not found in database. Creating now...");
      const id = uuidv4();
      const passwordHash = await bcrypt.hash("password123", 10);
      const userToken = `envvault_ut_${uuidv4().replace(/-/g, '')}`;
      await pool.query(
        "INSERT INTO users (id, email, password, role, status, user_token) VALUES ($1, $2, $3, $4, $5, $6)",
        [id, "admin@envvault.com", passwordHash, 'admin', 'approved', userToken]
      );
      console.log("Admin account created successfully.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Database Error:", err);
    process.exit(1);
  }
}

checkAdmin();
