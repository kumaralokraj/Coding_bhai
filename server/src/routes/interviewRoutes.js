import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as interviewController from "../controllers/interviewController.js";

const router = express.Router();

// Public routes
router.get("/questions", interviewController.getInterviewQuestions);
router.get("/questions/:id", interviewController.getQuestionById);

// Protected routes
router.post("/", authMiddleware, interviewController.startInterview);
router.get("/my-sessions", authMiddleware, interviewController.getUserInterviews);
router.get("/:id", authMiddleware, interviewController.getInterviewSession);
router.put("/:id", authMiddleware, interviewController.updateInterviewSession);
router.post("/:id/submit", authMiddleware, interviewController.submitInterview);

export default router;
