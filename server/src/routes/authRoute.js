// import express from "express";
// import { signup } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/signup", signup);

// export default router;
import express from "express";
import {
  signup,
  login,
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
router.patch("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;