import express from "express";
import {
  getSecrets,
  createSecret,
  updateSecret,
  deleteSecret,
  revealSecret,
  exportEnv
} from "../controllers/secretController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getSecrets);
router.post("/", authenticate, createSecret);
router.put("/:id", authenticate, updateSecret);
router.delete("/:id", authenticate, deleteSecret);
router.get("/:id/reveal", authenticate, revealSecret);
router.get("/export", authenticate, exportEnv);

export default router;
