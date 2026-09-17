import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as problemController from "../controllers/problemController.js";

const router = express.Router();

// Public routes
router.get("/", problemController.getAllProblems);
router.get("/:id", problemController.getProblemById);
router.get("/:id/test-cases", problemController.getTestCases);

// Protected routes
router.post("/", authMiddleware, problemController.createProblem);
router.put("/:id", authMiddleware, problemController.updateProblem);
router.delete("/:id", authMiddleware, problemController.deleteProblem);
router.post("/:id/test-cases", authMiddleware, problemController.addTestCase);

export default router;
