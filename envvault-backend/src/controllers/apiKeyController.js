import { pool } from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

// Generate a unique API key with EnvVault prefix
function generateApiKey() {
  const random = crypto.randomBytes(20).toString("hex");
  return `envvault_sk_${random}`;
}

export async function createApiKey(req, res) {
  const { project_name, environment } = req.body;

  if (!project_name || !environment) {
    return res.status(400).json({ error: "project_name and environment are required" });
  }

  const id = uuidv4();
  const apiKey = generateApiKey();

  try {
    await pool.query(
      "INSERT INTO api_keys (id, project_name, api_key, environment, created_by, created_at) VALUES ($1, $2, $3, $4, $5, NOW())",
      [id, project_name, apiKey, environment, req.user.id]
    );

    res.json({ id, project_name, api_key: apiKey, environment });
  } catch (error) {
    console.error("Create API key error:", error);
    res.status(500).json({ error: "Failed to create API key" });
  }
}

export async function listApiKeys(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, project_name, api_key, environment, created_at FROM api_keys WHERE created_by=$1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("List API keys error:", error);
    res.status(500).json({ error: "Failed to list API keys" });
  }
}

export async function deleteApiKey(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM api_keys WHERE id=$1 AND created_by=$2", [id, req.user.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "API key not found" });
    }

    res.json({ message: "API key deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete API key" });
  }
}
