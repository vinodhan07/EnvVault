import { Router } from "express";
import { pool } from "../db/db.js";
import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";
import { formatEnv } from "../utils/envFormatter.js";

const router = Router();

// GET /api/env — fetch secrets using API key
// Optional: ?format=json for JSON output
router.get("/env", apiKeyMiddleware, async (req, res) => {
  const { environment } = req.apiKeyData;
  const { format } = req.query;

  try {
    const result = await pool.query(
      "SELECT key, value FROM secrets WHERE environment=$1",
      [environment]
    );

    if (format === "json") {
      // Return as { KEY: "value", KEY2: "value2" }
      const obj = {};
      result.rows.forEach((row) => {
        obj[row.key] = row.value;
      });
      return res.json(obj);
    }

    // Default: return as .env text
    res.type("text/plain").send(formatEnv(result.rows));
  } catch (error) {
    console.error("Env access error:", error);
    res.status(500).json({ error: "Failed to fetch environment variables" });
  }
});

export default router;
