import { pool } from "../../server.js";

export const submitSolution = async (req, res, next) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      "INSERT INTO submissions (problem_id, user_id, code, language, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [problemId, userId, code, language, "pending"]
    );

    res.status(201).json({
      success: true,
      message: "Solution submitted successfully",
      submission: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubmissions = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM submissions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [userId, limit, offset]
    );

    res.json({
      success: true,
      submissions: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM submissions WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.json({
      success: true,
      submission: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemSubmissions = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.userId;

    const result = await pool.query(
      "SELECT * FROM submissions WHERE problem_id = $1 AND user_id = $2 ORDER BY created_at DESC",
      [problemId, userId]
    );

    res.json({
      success: true,
      submissions: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    const result = await pool.query(
      "UPDATE submissions SET code = $1, language = $2 WHERE id = $3 RETURNING *",
      [code, language, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.json({
      success: true,
      message: "Submission updated successfully",
      submission: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM submissions WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
