import { pool } from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import { formatEnv } from "../utils/envFormatter.js";

// Helper for audit logs
async function logAction(userId, action, secretKey, environment) {
  const id = uuidv4();
  await pool.query(
    "INSERT INTO audit_logs (id, user_id, action, secret_key, environment, timestamp) VALUES ($1, $2, $3, $4, $5, NOW())",
    [id, userId, action, secretKey, environment]
  );
}

export async function getSecrets(req, res) {
  const { environment } = req.query;

  try {
    const result = await pool.query(
      "SELECT id, key, description, environment, created_at, updated_at FROM secrets WHERE environment=$1 ORDER BY created_at DESC",
      [environment]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch secrets" });
  }
}

export async function createSecret(req, res) {
  const { key, value, description, environment } = req.body;
  const id = uuidv4();

  try {
    await pool.query(
      "INSERT INTO secrets (id, key, value, description, environment, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())",
      [id, key, value, description, environment, req.user.id]
    );

    await logAction(req.user.id, "Created", key, environment);
    res.json({ message: "Secret created", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create secret" });
  }
}

export async function updateSecret(req, res) {
  const { id } = req.params;
  const { value, description } = req.body;

  try {
    // Need to get the key to log it
    const secret = await pool.query("SELECT key, environment FROM secrets WHERE id=$1", [id]);
    if (secret.rows.length === 0) return res.status(404).json({ error: "Secret not found" });

    // If value is provided, update value and description. Else just description.
    if (value) {
      await pool.query(
        "UPDATE secrets SET value=$1, description=$2, updated_at=NOW() WHERE id=$3",
        [value, description, id]
      );
    } else {
       await pool.query(
        "UPDATE secrets SET description=$1, updated_at=NOW() WHERE id=$2",
        [description, id]
      );
    }

    await logAction(req.user.id, "Updated", secret.rows[0].key, secret.rows[0].environment);
    res.json({ message: "Secret updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update secret" });
  }
}

export async function deleteSecret(req, res) {
  const { id } = req.params;

  try {
    const secret = await pool.query("SELECT key, environment FROM secrets WHERE id=$1", [id]);
    if (secret.rows.length === 0) return res.status(404).json({ error: "Secret not found" });

    await pool.query("DELETE FROM secrets WHERE id=$1", [id]);

    await logAction(req.user.id, "Deleted", secret.rows[0].key, secret.rows[0].environment);
    res.json({ message: "Secret deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete secret" });
  }
}

export async function revealSecret(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT key, value, environment FROM secrets WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Secret not found" });

    await logAction(req.user.id, "Revealed", result.rows[0].key, result.rows[0].environment);
    res.json({ value: result.rows[0].value });
  } catch (error) {
    res.status(500).json({ error: "Failed to reveal secret" });
  }
}

export async function exportEnv(req, res) {
  const { environment } = req.query;

  try {
    const result = await pool.query(
      "SELECT key, value FROM secrets WHERE environment=$1",
      [environment]
    );
     await logAction(req.user.id, "Exported", `.env.${environment}`, environment);
    res.send(formatEnv(result.rows));
  } catch (error) {
    res.status(500).json({ error: "Failed to export secrets" });
  }
}
