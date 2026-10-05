import pool from "../config/db.js";

// ==========================================
// GET USER ACTIVITY
// ==========================================

export const getUserActivity = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      activity_date,
      problems_solved,
      submissions
    FROM user_activity
    WHERE user_id = $1
      AND activity_date >= CURRENT_DATE - INTERVAL '365 days'
    ORDER BY activity_date ASC
    `,
    [userId]
  );

  return result.rows;
};


// ==========================================
// RECORD ACTIVITY
// ==========================================

export const recordActivity = async (userId, solved = false) => {
  const result = await pool.query(
    `
    INSERT INTO user_activity (
      user_id,
      activity_date,
      problems_solved,
      submissions
    )
    VALUES (
      $1,
      CURRENT_DATE,
      $2,
      1
    )

    ON CONFLICT (user_id, activity_date)

    DO UPDATE SET
      problems_solved =
        user_activity.problems_solved + EXCLUDED.problems_solved,

      submissions =
        user_activity.submissions + 1,

      updated_at = CURRENT_TIMESTAMP

    RETURNING *;
    `,
    [
      userId,
      solved ? 1 : 0,
    ]
  );

  return result.rows[0];
};