import pool from "../config/db.js";
import { judgeSubmission } from "../services/judgeService.js";

export const submitSolution = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      problemId,
      language,
      code,
    } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "Problem ID, language and code are required",
      });
    }

    // Check problem
    const problemResult = await pool.query(
      `
      SELECT id, title
      FROM problem
      WHERE id = $1
      `,
      [problemId]
    );

    if (problemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Get hidden + sample test cases
    const testCaseResult = await pool.query(
      `
      SELECT
        id,
        input,
        expected_output,
        is_sample
      FROM problem_test_cases
      WHERE problem_id = $1
      ORDER BY id ASC
      `,
      [problemId]
    );

    if (testCaseResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No test cases available for this problem",
      });
    }

    // Judge code
    const result = await judgeSubmission({
      language,
      code,
      testCases: testCaseResult.rows,
    });

    // Save submission
    const submissionResult = await pool.query(
      `
      INSERT INTO submissions (
        user_id,
        problem_id,
        language,
        code,
        status,
        output,
        error,
        execution_time,
        memory_used
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      RETURNING *
      `,
      [
        userId,
        problemId,
        language,
        code,
        result.status,
        result.output,
        result.error,
        result.executionTime,
        result.memoryUsed,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Submission evaluated",
      submission: submissionResult.rows[0],
    });

  } catch (error) {
    console.error("SUBMISSION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit solution",
    });
  }
};