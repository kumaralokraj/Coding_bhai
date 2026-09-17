import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as executionController from "../controllers/executionController.js";

const router = express.Router();

// All execution routes require authentication
router.post("/run", authMiddleware, executionController.runCode);
router.post("/submit", authMiddleware, executionController.submitCode);
router.get("/status/:executionId", executionController.getExecutionStatus);
router.get("/history", authMiddleware, executionController.getExecutionHistory);
router.get("/:id", authMiddleware, executionController.getExecutionById);

export default router;
