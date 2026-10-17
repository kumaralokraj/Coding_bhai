
import pool from "../config/db.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const usersResult = await pool.query(`
      SELECT
        COUNT(*)::int AS total_users,
        COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active_users,
        COUNT(*) FILTER (WHERE role = 'admin')::int AS admins
      FROM users
    `);

    // Existing project mein problem table ka naam check karo.
    const tableResult = await pool.query(`
      SELECT
        to_regclass('public.problem') AS singular_table,
        to_regclass('public.problems') AS plural_table
    `);

    let totalProblems = 0;
    const problemTable =
      tableResult.rows[0].singular_table
        ? "problem"
        : tableResult.rows[0].plural_table
          ? "problems"
          : null;

    if (problemTable) {
      const problemResult = await pool.query(
        `SELECT COUNT(*)::int AS total FROM "${problemTable}"`
      );
      totalProblems = problemResult.rows[0].total;
    }

    let totalInterviews = 0;
    const interviewTable = await pool.query(
      `SELECT to_regclass('public.interviews') AS table_name`
    );

    if (interviewTable.rows[0].table_name) {
      const interviewResult = await pool.query(
        `SELECT COUNT(*)::int AS total FROM interviews`
      );
      totalInterviews = interviewResult.rows[0].total;
    }

    return res.json({
      success: true,
      stats: {
        ...usersResult.rows[0],
        total_problems: totalProblems,
        total_interviews: totalInterviews,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard",
    });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 200
    `);

    return res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load users",
    });
  }
};

export const setUserActiveStatus = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { isActive } = req.body;

    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    if (userId === Number(req.userId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    // Admin accounts are protected from this user-management action.
    const result = await pool.query(
      `UPDATE users
       SET is_active = $1,
           token_version = token_version + 1
       WHERE id = $2 AND role = 'user'
       RETURNING id, name, email, role, is_active`,
      [isActive, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found or account is protected",
      });
    }

    return res.json({
      success: true,
      message: isActive ? "User activated" : "User deactivated",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update user status",
    });
  }
};
