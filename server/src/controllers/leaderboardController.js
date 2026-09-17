import { pool } from "../../server.js";

export const getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, 
              COUNT(DISTINCT s.id) as problems_solved,
              COUNT(DISTINCT s.id) as total_submissions
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id AND s.status = 'accepted'
       GROUP BY u.id
       ORDER BY problems_solved DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      leaderboard: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getContestLeaderboard = async (req, res, next) => {
  try {
    const { contestId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.name, u.email,
              COUNT(DISTINCT s.id) as problems_solved
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id AND s.status = 'accepted'
       LEFT JOIN contest_participants cp ON u.id = cp.user_id AND cp.contest_id = $1
       WHERE cp.contest_id = $1
       GROUP BY u.id
       ORDER BY problems_solved DESC`,
      [contestId]
    );

    res.json({
      success: true,
      leaderboard: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserRank = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.name, u.email,
              COUNT(DISTINCT s.id) as problems_solved,
              (SELECT COUNT(*) + 1 FROM users u2 
               LEFT JOIN submissions s2 ON u2.id = s2.user_id AND s2.status = 'accepted'
               GROUP BY u2.id 
               HAVING COUNT(DISTINCT s2.id) > (
                 SELECT COUNT(DISTINCT s3.id) FROM submissions s3 
                 WHERE s3.user_id = $1 AND s3.status = 'accepted'
               )) as rank
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id AND s.status = 'accepted'
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      userRank: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT u.id, u.name, u.email,
              COUNT(DISTINCT s.id) as problems_solved,
              COUNT(DISTINCT s.id) as total_submissions,
              (SELECT COUNT(DISTINCT difficulty) FROM submissions s2 
               WHERE s2.user_id = $1 AND s2.status = 'accepted'
               JOIN problems p ON s2.problem_id = p.id) as difficulty_solved
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      stats: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const refreshLeaderboard = async (req, res, next) => {
  try {
    // TODO: Implement leaderboard refresh logic
    // This could involve recalculating ranks, scores, etc.

    res.json({
      success: true,
      message: "Leaderboard refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};
