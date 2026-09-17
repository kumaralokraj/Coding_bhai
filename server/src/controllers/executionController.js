import { pool } from "../../server.js";

export const runCode = async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      "INSERT INTO executions (user_id, code, language, input, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, code, language, input, "running"]
    );

    // TODO: Execute code here and update status
    res.status(201).json({
      success: true,
      message: "Code execution started",
      execution: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const submitCode = async (req, res, next) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      "INSERT INTO submissions (problem_id, user_id, code, language, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [problemId, userId, code, language, "pending"]
    );

    // TODO: Execute against test cases
    res.status(201).json({
      success: true,
      message: "Code submitted for evaluation",
      submission: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getExecutionStatus = async (req, res, next) => {
  try {
    const { executionId } = req.params;

    const result = await pool.query(
      "SELECT * FROM executions WHERE id = $1",
      [executionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Execution not found",
      });
    }

    res.json({
      success: true,
      execution: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getExecutionHistory = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM executions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [userId, limit, offset]
    );

    res.json({
      success: true,
      executions: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getExecutionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM executions WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Execution not found",
      });
    }

    res.json({
      success: true,
      execution: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
