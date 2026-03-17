import { pool } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    console.log(`[AUTH] Login attempt for: ${email}`);

    if (userResult.rows.length === 0) {
      console.log(`[AUTH] User not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check approval status
    if (user.status === 'pending') {
      return res.status(403).json({ 
        message: "Account pending approval. Please wait for an admin to approve your request.", 
        code: "ACCOUNT_PENDING" 
      });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ 
        message: "Your registration request has been rejected.", 
        code: "ACCOUNT_REJECTED" 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        status: user.status,
        user_token: user.user_token // Include the identity token if approved
      } 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    // New users are created with status='pending' and role='user' by default from database schema
    await pool.query(
      "INSERT INTO users (id, email, password) VALUES ($1, $2, $3)",
      [id, email, passwordHash]
    );

    res.status(201).json({ message: "Registration successful. Your account is now pending admin approval." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
