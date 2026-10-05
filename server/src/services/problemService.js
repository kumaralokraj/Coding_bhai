import pool from "../config/db.js";

// ================= GET ALL PROBLEMS =================

export const getProblems = async ({
  page = 1,
  limit = 20,
  difficulty,
  category,
  search,
}) => {
  const offset = (page - 1) * limit;

  const conditions = [];
  const values = [];
  let index = 1;

  if (difficulty) {
    conditions.push(`difficulty = $${index++}`);
    values.push(difficulty);
  }

  if (category) {
    conditions.push(`category = $${index++}`);
    values.push(category);
  }

  if (search) {
    conditions.push(`
      (
        title ILIKE $${index}
        OR description ILIKE $${index}
      )
    `);

    values.push(`%${search}%`);
    index++;
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM problem
    ${whereClause}
    `,
    values
  );

  const total = Number(countResult.rows[0].total);

  const result = await pool.query(
    `
    SELECT
      id,
      title,
      slug,
      description,
      difficulty,
      category,
      tags,
      companies,
      acceptance_rate,
      total_submissions,
      total_accepted,
      created_at
    FROM problem
    ${whereClause}
    ORDER BY id DESC
    LIMIT $${index}
    OFFSET $${index + 1}
    `,
    [...values, limit, offset]
  );

  return {
    problems: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
};


// ================= GET SINGLE PROBLEM =================

export const getProblemById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      slug,
      description,
      difficulty,
      category,
      tags,
      companies,
      acceptance_rate,
      total_submissions,
      total_accepted,
      created_at
    FROM problem
    WHERE id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Problem not found");
  }

  return result.rows[0];
};