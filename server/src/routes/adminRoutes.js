
import express from "express";
import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";

import {
  getAdminDashboard,
  getAdminUsers,
  setUserActiveStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);
router.patch("/users/:id/status", setUserActiveStatus);

export default router;
