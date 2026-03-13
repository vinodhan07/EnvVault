import { pool } from "../db/db.js";

export async function getAuditLogs(req, res) {
  try {
    const result = await pool.query(`
      SELECT a.id, a.action, a.secret_key as "secretKey", a.environment, a.timestamp, u.email as user
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.timestamp DESC
      LIMIT 100
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch audit logs", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
}
