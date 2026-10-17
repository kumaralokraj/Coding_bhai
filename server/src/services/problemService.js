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
// ================= ADMIN: CREATE PROBLEM =================

export const createProblem = async (data) => {
  const {
    title,
    slug,
    description,
    difficulty,
    category,
    tags = [],
    companies = [],
    acceptance_rate = 0,
    starter_code = {},
    solution = {},
    test_cases = [],
  } = data;

  if (!title || !slug || !description || !difficulty || !category) {
    throw new Error(
      "Title, slug, description, difficulty and category are required"
    );
  }

  const result = await pool.query(
    `INSERT INTO problem
      (title, slug, description, difficulty, category, tags, companies,
       acceptance_rate, starter_code, solution, test_cases)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11::jsonb)
     RETURNING id, title, slug, description, difficulty, category,
               tags, companies, created_at`,
    [
      title,
      slug,
      description,
      difficulty,
      category,
      tags,
      companies,
      acceptance_rate,
      JSON.stringify(starter_code),
      JSON.stringify(solution),
      JSON.stringify(test_cases),
    ]
  );

  return result.rows[0];
};


// ================= ADMIN: UPDATE PROBLEM =================

export const updateProblem = async (id, data) => {
  const allowedFields = [
    "title",
    "slug",
    "description",
    "difficulty",
    "category",
    "tags",
    "companies",
    "acceptance_rate",
    "starter_code",
    "solution",
    "test_cases",
  ];

  const jsonFields = ["starter_code", "solution", "test_cases"];
  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (data[field] === undefined) continue;

    let value = data[field];

    if (jsonFields.includes(field)) {
      value = JSON.stringify(value);
    }

    values.push(value);
    const placeholder = `$${values.length}`;

    updates.push(
      jsonFields.includes(field)
        ? `${field} = ${placeholder}::jsonb`
        : `${field} = ${placeholder}`
    );
  }

  if (updates.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  updates.push("updated_at = NOW()");
  values.push(id);

  const result = await pool.query(
    `UPDATE problem
     SET ${updates.join(", ")}
     WHERE id = $${values.length}
     RETURNING id, title, slug, description, difficulty, category,
               tags, companies, updated_at`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Problem not found");
  }

  return result.rows[0];
};


// ================= ADMIN: DELETE PROBLEM =================

export const deleteProblem = async (id) => {
  const result = await pool.query(
    `DELETE FROM problem
     WHERE id = $1
     RETURNING id, title`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Problem not found");
  }

  return result.rows[0];
};