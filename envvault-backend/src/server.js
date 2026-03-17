import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import secretRoutes from "./routes/secretRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import apiKeyRoutes from "./routes/apiKeyRoutes.js";
import envAccessRoutes from "./routes/envAccessRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/secrets", secretRoutes);
app.use("/audit-logs", auditRoutes);
app.use("/api-keys", apiKeyRoutes);
app.use("/api", envAccessRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "EnvVault API Operational", status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EnvVault backend running on port ${PORT}`);
  const dbUrl = process.env.DATABASE_URL || "";
  console.log(`[DB] Connected to: ${dbUrl.substring(0, 20)}...`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});
