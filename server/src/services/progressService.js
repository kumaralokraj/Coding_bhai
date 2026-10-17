
import pool from "../config/db.js";

export const getUserProgress = async (userId) => {
  const [summaryResult, topicsResult, activityResult] =
    await Promise.all([
      // Overall submission summary
      pool.query(
        `
        SELECT
          COUNT(*)::int AS total_submissions,
          COUNT(*) FILTER (
            WHERE LOWER(status) = 'accepted'
          )::int AS accepted_submissions,
          COUNT(DISTINCT problem_id)::int AS attempted_problems,
          COUNT(DISTINCT problem_id) FILTER (
            WHERE LOWER(status) = 'accepted'
          )::int AS solved_problems
        FROM submissions
        WHERE user_id = $1
        `,
        [userId]
      ),

      // Topic summary
      // Category column removed because it does not exist.
      // Using one overall group until the actual topic column is confirmed.
      pool.query(
        `
        SELECT
          'All Problems' AS category,
          COUNT(DISTINCT p.id)::int AS total_problems,
          COUNT(DISTINCT s.problem_id) FILTER (
            WHERE LOWER(s.status) = 'accepted'
          )::int AS solved_problems
        FROM problem p
        LEFT JOIN submissions s
          ON s.problem_id = p.id
          AND s.user_id = $1
        `,
        [userId]
      ),

      // Recent activity
      pool.query(
        `
        SELECT
          created_at::date AS date,
          COUNT(*)::int AS submissions,
          COUNT(DISTINCT problem_id) FILTER (
            WHERE LOWER(status) = 'accepted'
          )::int AS solved_problems
        FROM submissions
        WHERE user_id = $1
          AND created_at >= CURRENT_DATE - INTERVAL '83 days'
        GROUP BY created_at::date
        ORDER BY date
        `,
        [userId]
      ),
    ]);

  const summary = summaryResult.rows[0];

  const acceptedSubmissions = Number(
    summary.accepted_submissions
  );

  const totalSubmissions = Number(
    summary.total_submissions
  );

  return {
    summary: {
      totalSubmissions,
      acceptedSubmissions,
      attemptedProblems: Number(summary.attempted_problems),
      solvedProblems: Number(summary.solved_problems),
      acceptanceRate: totalSubmissions
        ? Math.round(
            (acceptedSubmissions / totalSubmissions) * 100
          )
        : 0,
    },

    topics: topicsResult.rows.map((topic) => ({
      name: topic.category,
      totalProblems: Number(topic.total_problems),
      solvedProblems: Number(topic.solved_problems),
    })),

    activity: activityResult.rows.map((day) => ({
      date: String(day.date).slice(0, 10),
      submissions: Number(day.submissions),
      solvedProblems: Number(day.solved_problems),
    })),
  };
};
