import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.get("/:id", userController.getUserProfile);
router.get("/:id/submissions", userController.getUserSubmissions);
router.get("/:id/statistics", userController.getUserStatistics);

// Protected routes
router.put("/profile", authMiddleware, userController.updateProfile);
router.put("/password", authMiddleware, userController.changePassword);
router.put("/preferences", authMiddleware, userController.updatePreferences);
router.get("/me", authMiddleware, userController.getCurrentUser);
router.delete("/account", authMiddleware, userController.deleteAccount);

export default router;
