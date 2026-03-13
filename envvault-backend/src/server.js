import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import secretRoutes from "./routes/secretRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import apiKeyRoutes from "./routes/apiKeyRoutes.js";
import envAccessRoutes from "./routes/envAccessRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/secrets", secretRoutes);
app.use("/audit-logs", auditRoutes);
app.use("/api-keys", apiKeyRoutes);
app.use("/api", envAccessRoutes);

app.get("/", (req, res) => {
  res.json({ message: "EnvVault API Operational", status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EnvVault backend running on port ${PORT}`);
});
