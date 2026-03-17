import { pool } from "../db/db.js";
import { v4 as uuidv4 } from "uuid";

export async function listUsers(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, email, role, status, user_token, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "Failed to list users" });
  }
}

export async function approveUser(req, res) {
  const { id } = req.params;

  try {
    // Check if user exists
    const userResult = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];
    
    // Generate token if not already present
    const userToken = user.user_token || `envvault_ut_${uuidv4().replace(/-/g, '')}`;

    await pool.query(
      "UPDATE users SET status='approved', user_token=$1 WHERE id=$2",
      [userToken, id]
    );

    res.json({ message: "User approved successfully", user_token: userToken });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ error: "Failed to approve user" });
  }
}

export async function rejectUser(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE users SET status='rejected' WHERE id=$1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("Reject user error:", error);
    res.status(500).json({ error: "Failed to reject user" });
  }
}
