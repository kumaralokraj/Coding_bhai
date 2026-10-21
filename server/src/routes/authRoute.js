
import express from "express";

import {
  signup,
  login,
  googleLogin,
} from "../controllers/authController.js";

import {
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/passwordController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

router.patch("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
