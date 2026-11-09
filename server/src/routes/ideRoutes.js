
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  listLanguages,
  submitCode,
  submissionResult,
} from "../controllers/ideController.js";

const router = Router();

const executionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many executions. Please try again shortly.",
  },
});

const resultLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many result checks. Please try again later.",
  },
});

router.get("/languages", listLanguages);
router.post("/run", executionLimiter, submitCode);
router.get("/result/:token", resultLimiter, submissionResult);

export default router;
