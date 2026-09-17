import { pool } from "../../server.js";

export const getAllContests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM contests WHERE 1=1";
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += " ORDER BY start_time DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      contests: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getContestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM contests WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    res.json({
      success: true,
      contest: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getContestProblems = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT p.* FROM problems p JOIN contest_problems cp ON p.id = cp.problem_id WHERE cp.contest_id = $1",
      [id]
    );

    res.json({
      success: true,
      problems: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getContestLeaderboard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT u.id, u.name, u.email, COUNT(s.id) as solved, SUM(EXTRACT(EPOCH FROM (s.created_at - c.start_time))) as time_taken FROM users u LEFT JOIN submissions s ON u.id = s.user_id LEFT JOIN contests c ON c.id = $1 WHERE s.status = 'accepted' GROUP BY u.id ORDER BY solved DESC",
      [id]
    );

    res.json({
      success: true,
      leaderboard: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const createContest = async (req, res, next) => {
  try {
    const { title, description, start_time, end_time, status } = req.body;

    const result = await pool.query(
      "INSERT INTO contests (title, description, start_time, end_time, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, start_time, end_time, status, req.userId]
    );

    res.status(201).json({
      success: true,
      message: "Contest created successfully",
      contest: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateContest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, start_time, end_time, status } = req.body;

    const result = await pool.query(
      "UPDATE contests SET title = $1, description = $2, start_time = $3, end_time = $4, status = $5 WHERE id = $6 RETURNING *",
      [title, description, start_time, end_time, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    res.json({
      success: true,
      message: "Contest updated successfully",
      contest: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM contests WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    res.json({
      success: true,
      message: "Contest deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const joinContest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await pool.query(
      "INSERT INTO contest_participants (contest_id, user_id) VALUES ($1, $2) RETURNING *",
      [id, userId]
    );

    res.status(201).json({
      success: true,
      message: "Joined contest successfully",
      participant: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const leaveContest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await pool.query(
      "DELETE FROM contest_participants WHERE contest_id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    res.json({
      success: true,
      message: "Left contest successfully",
    });
  } catch (error) {
    next(error);
  }
};
