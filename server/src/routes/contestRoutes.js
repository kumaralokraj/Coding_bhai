import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as contestController from "../controllers/contestController.js";

const router = express.Router();

// Public routes
router.get("/", contestController.getAllContests);
router.get("/:id", contestController.getContestById);
router.get("/:id/problems", contestController.getContestProblems);
router.get("/:id/leaderboard", contestController.getContestLeaderboard);

// Protected routes
router.post("/", authMiddleware, contestController.createContest);
router.put("/:id", authMiddleware, contestController.updateContest);
router.delete("/:id", authMiddleware, contestController.deleteContest);
router.post("/:id/join", authMiddleware, contestController.joinContest);
router.post("/:id/leave", authMiddleware, contestController.leaveContest);

export default router;
