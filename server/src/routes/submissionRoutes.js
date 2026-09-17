import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as submissionController from "../controllers/submissionController.js";

const router = express.Router();

// All submission routes require authentication
router.post("/", authMiddleware, submissionController.submitSolution);
router.get("/", authMiddleware, submissionController.getUserSubmissions);
router.get("/:id", authMiddleware, submissionController.getSubmissionById);
router.get("/problem/:problemId", authMiddleware, submissionController.getProblemSubmissions);
router.put("/:id", authMiddleware, submissionController.updateSubmission);
router.delete("/:id", authMiddleware, submissionController.deleteSubmission);

export default router;
