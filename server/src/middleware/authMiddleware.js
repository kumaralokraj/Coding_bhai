// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided. Authorization required.",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//       error: error.message,
//     });
//   }
// };

// export default authMiddleware;
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT id, role, is_active, token_version
       FROM users
       WHERE id = $1`,
      [decoded.id]
    );

    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account unavailable or inactive",
      });
    }

    // Password change ke baad purane tokens reject honge.
    const tokenVersion = decoded.tokenVersion ?? 0;

    if (tokenVersion !== user.token_version) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    req.userId = user.id;
    req.user = {
      ...decoded,
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    // authMiddleware pehle user ka current role database se verify karta hai.
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to verify admin access",
    });
  }
};

export default authMiddleware;
