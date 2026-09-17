import pool from "../config/db.js";

export const getDashboardData = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      up.problems_solved,
      up.current_streak,
      up.coding_score,
      up.global_rank,
      up.dsa_progress,
      up.javascript_progress,
      up.react_progress,
      up.backend_progress
    FROM users u
    LEFT JOIN user_progress up
      ON u.id = up.user_id
    WHERE u.id = $1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },

    stats: {
      problemsSolved: user.problems_solved || 0,
      currentStreak: user.current_streak || 0,
      codingScore: user.coding_score || 0,
      globalRank: user.global_rank || null,
    },

    progress: {
      dsa: user.dsa_progress || 0,
      javascript: user.javascript_progress || 0,
      react: user.react_progress || 0,
      backend: user.backend_progress || 0,
    },
  };
};