import { pool } from "../../server.js";

export const getAllProblems = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, difficulty, status } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM problems WHERE 1=1";
    const params = [];

    if (difficulty) {
      params.push(difficulty);
      query += ` AND difficulty = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += " ORDER BY id DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      problems: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM problems WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      problem: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getTestCases = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM test_cases WHERE problem_id = $1",
      [id]
    );

    res.json({
      success: true,
      testCases: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const createProblem = async (req, res, next) => {
  try {
    const { title, description, difficulty, constraints, examples, category } = req.body;

    const result = await pool.query(
      "INSERT INTO problems (title, description, difficulty, constraints, examples, category, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, description, difficulty, constraints, examples, category, req.userId]
    );

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, constraints, examples, category } = req.body;

    const result = await pool.query(
      "UPDATE problems SET title = $1, description = $2, difficulty = $3, constraints = $4, examples = $5, category = $6 WHERE id = $7 RETURNING *",
      [title, description, difficulty, constraints, examples, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      message: "Problem updated successfully",
      problem: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM problems WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addTestCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { input, output } = req.body;

    const result = await pool.query(
      "INSERT INTO test_cases (problem_id, input, output) VALUES ($1, $2, $3) RETURNING *",
      [id, input, output]
    );

    res.status(201).json({
      success: true,
      message: "Test case added successfully",
      testCase: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
