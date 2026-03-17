import { pool } from "../db/db.js";

// Middleware to authenticate requests using an API key AND a user identity token
// Header format: 
// Authorization: Bearer envvault_sk_xxx
// X-User-Token: envvault_ut_yyy
export async function apiKeyMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const userToken = req.headers["x-user-token"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  if (!userToken || !userToken.startsWith("envvault_ut_")) {
    return res.status(403).json({ error: "Missing or invalid X-User-Token header" });
  }

  const apiKey = authHeader.split(" ")[1];

  try {
    // 1. Verify API Key
    const apiKeyResult = await pool.query(
      "SELECT id, project_name, api_key, environment, created_by FROM api_keys WHERE api_key=$1",
      [apiKey]
    );

    if (apiKeyResult.rows.length === 0) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    // 2. Verify User Token and Status
    const userResult = await pool.query(
      "SELECT id, email, role, status FROM users WHERE user_token=$1",
      [userToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: "Invalid user token" });
    }

    const user = userResult.rows[0];

    if (user.status !== "approved") {
      return res.status(403).json({ error: `Account ${user.status}. Access denied.` });
    }

    // Attach metadata to the request for downstream use
    req.apiKeyData = apiKeyResult.rows[0];
    req.userData = user;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
