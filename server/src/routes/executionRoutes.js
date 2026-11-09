
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import {
  runCode,
  fetchExecutionResult,
  fetchLanguages,
} from "../controllers/executionController.js";

const router = Router();

const executionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many execution requests. Try again later.",
  },
});

const resultLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many result checks. Try again later.",
  },
});

router.get("/languages", fetchLanguages);

router.post("/", executionLimiter, runCode);

router.get("/:token", resultLimiter, fetchExecutionResult);

export default router;
