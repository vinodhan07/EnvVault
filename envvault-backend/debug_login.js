import { pool } from "./src/db/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

async function debugLogin() {
  try {
    const email = "admin@envvault.com";
    const rawPassword = "password123";

    const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (res.rows.length === 0) {
      console.log("User not found: " + email);
      process.exit(1);
    }

    const user = res.rows[0];
    console.log("User found in DB:");
    console.log({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      user_token: user.user_token
    });

    const isMatch = await bcrypt.compare(rawPassword, user.password);
    console.log("Password match check (locally):", isMatch);

    if (user.status !== 'approved' || user.role !== 'admin' || !isMatch) {
      console.log("Fixing user record...");
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      await pool.query(
        "UPDATE users SET role = 'admin', status = 'approved', password = $1 WHERE email = $2",
        [hashedPassword, email]
      );
      console.log("User record updated.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Debug Query Error:", err);
    process.exit(1);
  }
}

debugLogin();
