import express from "express";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import { listUsers, approveUser, rejectUser } from "../controllers/adminController.js";

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(authenticate);
router.use(requireAdmin);

router.get("/users", listUsers);
router.post("/users/:id/approve", approveUser);
router.post("/users/:id/reject", rejectUser);

export default router;
