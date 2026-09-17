import express from "express";

import {
  getSettings,
  updateSettings,
  updatePassword,
} from "../controllers/setting.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


// Get settings
router.get(
  "/",
  authMiddleware,
  getSettings
);


// Update settings
router.put(
  "/",
  authMiddleware,
  updateSettings
);
// router.put(
//     "/",
//     authMiddleware,
//     updatePassword
// );
router.put(
  "/password",
  authMiddleware,
  updatePassword
);

export default router;