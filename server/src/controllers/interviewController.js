import { pool } from "../../server.js";

export const getInterviewQuestions = async (req, res, next) => {
  try {
    const { difficulty, topic, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM interview_questions WHERE 1=1";
    const params = [];

    if (difficulty) {
      params.push(difficulty);
      query += ` AND difficulty = $${params.length}`;
    }

    if (topic) {
      params.push(topic);
      query += ` AND topic = $${params.length}`;
    }

    query += " LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      questions: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM interview_questions WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      question: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const startInterview = async (req, res, next) => {
  try {
    const { difficulty } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      "INSERT INTO interviews (user_id, difficulty, status, started_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [userId, difficulty, "in_progress"]
    );

    res.status(201).json({
      success: true,
      message: "Interview started",
      interview: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM interviews WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    res.json({
      success: true,
      interview: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateInterviewSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, score } = req.body;

    const result = await pool.query(
      "UPDATE interviews SET status = $1, notes = $2, score = $3 WHERE id = $4 RETURNING *",
      [status, notes, score, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    res.json({
      success: true,
      message: "Interview updated successfully",
      interview: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const submitInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const result = await pool.query(
      "UPDATE interviews SET status = $1, answers = $2, ended_at = NOW() WHERE id = $3 RETURNING *",
      ["completed", answers, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    res.json({
      success: true,
      message: "Interview submitted successfully",
      interview: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getUserInterviews = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM interviews WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [userId, limit, offset]
    );

    res.json({
      success: true,
      interviews: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
