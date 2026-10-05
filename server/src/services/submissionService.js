import pool from "../config/db.js";

export const createSubmission = async ({
  userId,
  problemId,
  language,
  code,
}) => {
  const result = await pool.query(
    `
    INSERT INTO submissions (
      user_id,
      problem_id,
      language,
      code,
      status
    )
    VALUES ($1, $2, $3, $4, 'PENDING')
    RETURNING *
    `,
    [
      userId,
      problemId,
      language,
      code,
    ]
  );

  return result.rows[0];
};