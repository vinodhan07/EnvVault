import { pool } from "../db/db.js";

// Middleware to authenticate requests using an API key
// Header format: Authorization: Bearer envvault_sk_xxx
export async function apiKeyMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const apiKey = authHeader.split(" ")[1];

  if (!apiKey || !apiKey.startsWith("envvault_sk_")) {
    return res.status(403).json({ error: "Invalid API key format" });
  }

  try {
    const result = await pool.query(
      "SELECT id, project_name, api_key, environment, created_by FROM api_keys WHERE api_key=$1",
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    // Attach key metadata to the request for downstream use
    req.apiKeyData = result.rows[0];
    next();
  } catch (error) {
    console.error("API Key middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
