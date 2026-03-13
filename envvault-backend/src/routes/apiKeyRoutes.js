import { Router } from "express";
import { createApiKey, listApiKeys, deleteApiKey } from "../controllers/apiKeyController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

// All API key management routes require JWT authentication
router.post("/", authenticate, createApiKey);
router.get("/", authenticate, listApiKeys);
router.delete("/:id", authenticate, deleteApiKey);

export default router;
