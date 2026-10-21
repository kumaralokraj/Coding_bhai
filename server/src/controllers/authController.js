import { signupUser } from "../services/authService.js";
import { loginUser } from "../services/authService.js";
import { googleLoginUser } from "../services/authService.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await signupUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: error.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const result = await googleLoginUser(credential);

    console.log("Google login result:", {
      hasToken: Boolean(result?.token),
      hasUser: Boolean(result?.user),
    });

    if (!result?.token || !result?.user) {
      return res.status(500).json({
        success: false,
        message: "Token or user missing from authentication service",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(401).json({
      success: false,
      message: error.message || "Google authentication failed",
    });
  }
};


