import express from "express";

import {
  fetchActivity,
  createActivity,
} from "../controllers/activityController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// GET /api/activity
router.get(
  "/",
  authMiddleware,
  fetchActivity
);


// POST /api/activity
router.post(
  "/",
  authMiddleware,
  createActivity
);


export default router;