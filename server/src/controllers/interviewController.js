import pool from "../config/db.js";

export const getInterviewQuestions = async (req, res, next) => {
  try {
    const { difficulty, topic } = req.query;
    const page = Number(req.query.page || 1);
    const limit = Math.min(Number(req.query.limit || 10), 50);

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers.",
      });
    }

    const offset = (page - 1) * limit;
    let query = `
      SELECT id, question, difficulty, topic, hints
      FROM interview_questions
      WHERE 1 = 1
    `;
    const params = [];

    if (difficulty) {
      params.push(String(difficulty).toLowerCase());
      query += ` AND difficulty = $${params.length}`;
    }

    if (topic) {
      params.push(String(topic));
      query += ` AND topic = $${params.length}`;
    }

    query += ` ORDER BY id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      questions: result.rows,
    });
  } catch (error) {
    return next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, question, difficulty, topic, hints FROM interview_questions WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.json({
      success: true,
      question: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
};

export const startInterview = async (req, res, next) => {
  try {
    const difficulty = String(req.body.difficulty || "").toLowerCase();
    const userId = req.userId;

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Choose easy, medium, or hard difficulty.",
      });
    }

    const questionIds = Array.isArray(req.body.questionIds)
      ? [...new Set(req.body.questionIds.map(Number))]
      : [];

    if (
      questionIds.length === 0 ||
      questionIds.length > 20 ||
      questionIds.some((id) => !Number.isSafeInteger(id) || id < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Select between 1 and 20 valid interview questions.",
      });
    }

    const selectedQuestions = await pool.query(
      "SELECT id FROM interview_questions WHERE id = ANY($1::int[]) AND difficulty = $2",
      [questionIds, difficulty]
    );

    if (selectedQuestions.rows.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some selected questions are not available for this difficulty.",
      });
    }

    const result = await pool.query(
      "INSERT INTO interviews (user_id, difficulty, status, started_at, answers) VALUES ($1, $2, $3, NOW(), $4) RETURNING *",
      [userId, difficulty, "in_progress", JSON.stringify({ questionIds })]
    );

    return res.status(201).json({
      success: true,
      message: "Interview started",
      interview: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
};

export const getInterviewSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM interviews WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    const interview = result.rows[0];
    const answers = interview.answers;
    const questionIds = Array.isArray(answers?.questionIds)
      ? answers.questionIds
      : Array.isArray(answers)
        ? answers.map((answer) => answer.questionId)
        : [];
    let questions = [];

    if (questionIds.length > 0) {
      const includeAnswers = interview.status === "completed";
      const columns = includeAnswers
        ? "id, question, difficulty, topic, answer, hints"
        : "id, question, difficulty, topic, hints";
      const questionResult = await pool.query(
        `SELECT ${columns} FROM interview_questions WHERE id = ANY($1::int[])`,
        [questionIds]
      );
      const questionMap = new Map(
        questionResult.rows.map((question) => [question.id, question])
      );
      questions = questionIds
        .map((questionId) => questionMap.get(Number(questionId)))
        .filter(Boolean);
    }

    return res.json({
      success: true,
      interview,
      questions,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateInterviewSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await pool.query(
      "UPDATE interviews SET notes = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 AND status = 'in_progress' RETURNING *",
      [typeof notes === "string" ? notes.slice(0, 5000) : null, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    return res.json({
      success: true,
      message: "Interview updated successfully",
      interview: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
};

export const submitInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Submit answers for your interview questions.",
      });
    }

    if (
      answers.some(
        (item) =>
          !Number.isSafeInteger(Number(item.questionId)) ||
          typeof item.answer !== "string" ||
          item.answer.length > 10000
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Interview answers must have a valid question and be under 10,000 characters.",
      });
    }

    const interviewResult = await pool.query(
      "SELECT answers FROM interviews WHERE id = $1 AND user_id = $2 AND status = 'in_progress'",
      [id, req.userId]
    );

    if (interviewResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found or already completed.",
      });
    }

    const storedQuestionIds = interviewResult.rows[0].answers?.questionIds || [];
    const submittedQuestionIds = [...new Set(answers.map((item) => Number(item.questionId)))];

    if (
      answers.length !== storedQuestionIds.length ||
      submittedQuestionIds.length !== storedQuestionIds.length ||
      storedQuestionIds.some((questionId) => !submittedQuestionIds.includes(Number(questionId)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Submit an answer entry for each question in this interview.",
      });
    }

    const normalizedAnswers = answers.map((item) => ({
      questionId: Number(item.questionId),
      answer: item.answer.trim(),
    }));
    const answeredCount = normalizedAnswers.filter((item) => item.answer.length > 0).length;
    const score = Math.round((answeredCount / storedQuestionIds.length) * 100);

    const result = await pool.query(
      "UPDATE interviews SET status = $1, answers = $2, score = $3, ended_at = NOW(), updated_at = NOW() WHERE id = $4 AND user_id = $5 AND status = 'in_progress' RETURNING *",
      ["completed", JSON.stringify(normalizedAnswers), score, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    return res.json({
      success: true,
      message: "Interview submitted successfully",
      interview: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserInterviews = async (req, res, next) => {
  try {
    const userId = req.userId;
    const page = Number(req.query.page || 1);
    const limit = Math.min(Number(req.query.limit || 10), 50);

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers.",
      });
    }

    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM interviews WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [userId, limit, offset]
    );

    return res.json({
      success: true,
      interviews: result.rows,
    });
  } catch (error) {
    return next(error);
  }
};
