import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as leaderboardController from "../controllers/leaderboardController.js";

const router = express.Router();

// Public routes
router.get("/", leaderboardController.getGlobalLeaderboard);
router.get("/contest/:contestId", leaderboardController.getContestLeaderboard);
router.get("/user/:userId", leaderboardController.getUserRank);

// Protected routes
router.get("/stats", authMiddleware, leaderboardController.getUserStats);
router.post("/refresh", authMiddleware, leaderboardController.refreshLeaderboard);

export default router;
