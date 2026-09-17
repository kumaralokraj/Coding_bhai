import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as aiController from "../controllers/aiController.js";

const router = express.Router();

// All AI routes require authentication
router.post("/generate-hint", authMiddleware, aiController.generateHint);
router.post("/solve-problem", authMiddleware, aiController.solveProblem);
router.post("/analyze-code", authMiddleware, aiController.analyzeCode);
router.post("/generate-explanation", authMiddleware, aiController.generateExplanation);
router.get("/suggestions/:problemId", authMiddleware, aiController.getCodeSuggestions);

export default router;
