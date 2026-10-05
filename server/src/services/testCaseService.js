import pool from "../config/db.js";

export const getTestCasesByProblemId = async (problemId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      problem_id,
      input,
      expected_output,
      is_sample
    FROM test_cases
    WHERE problem_id = $1
    ORDER BY id ASC
    `,
    [problemId]
  );

  return result.rows;
};