import express from "express";

import {
  profile,
  editProfile,
  updatePassword
} from "../controllers/profile.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


// Get profile
router.get(
  "/",
  authMiddleware,
  profile
);


// Update profile
router.put(
  "/",
  authMiddleware,
  editProfile
);
router.put(
  "/password",
  authMiddleware,
  updatePassword
);

export default router;