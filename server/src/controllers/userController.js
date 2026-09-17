import { pool } from "../../server.js";
import bcryptjs from "bcryptjs";

export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubmissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM submissions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [id, limit, offset]
    );

    res.json({
      success: true,
      submissions: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStatistics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT CASE WHEN s.status = 'accepted' THEN s.id END) as problems_solved,
        COUNT(DISTINCT s.id) as total_submissions,
        COUNT(DISTINCT c.id) as contests_participated
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id
       LEFT JOIN contest_participants cp ON u.id = cp.user_id
       LEFT JOIN contests c ON cp.contest_id = c.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      statistics: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      "UPDATE users SET name = $1, bio = $2 WHERE id = $3 RETURNING id, email, name, bio",
      [name, bio, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;

    // Get user
    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    // Verify old password
    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update password
    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const { theme, notifications, language } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      "UPDATE users SET preferences = $1 WHERE id = $2 RETURNING *",
      [JSON.stringify({ theme, notifications, language }), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Preferences updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.userId;

    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
