import express from "express";

import {
  submitSolution,
} from "../controllers/submissionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/submit",
  authMiddleware,
  submitSolution
);

export default router;