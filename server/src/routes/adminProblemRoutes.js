
import express from "express";

import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";

import {
  adminCreateProblem,
  adminUpdateProblem,
  adminDeleteProblem,
} from "../controllers/problemController.js";

const router = express.Router();

// All routes below require an authenticated admin.
router.use(authMiddleware, adminMiddleware);

router.post("/", adminCreateProblem);
router.patch("/:id", adminUpdateProblem);
router.delete("/:id", adminDeleteProblem);

export default router;
