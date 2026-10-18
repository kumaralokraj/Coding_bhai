
import pool from "../config/db.js";

const validStatus = (status) =>
  status === "draft" || status === "published";

const makeSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "This slug or lesson position already exists.",
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Invalid course ID.",
      });
    }

    console.error("Course management error:", error.message);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const getCourses = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.*,
       COUNT(l.id)::int AS lesson_count
     FROM courses c
     LEFT JOIN lessons l ON l.course_id = c.id
     GROUP BY c.id
     ORDER BY c.created_at DESC`
  );

  res.json({ courses: rows });
});

export const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description = "",
    category = "Programming",
    thumbnail_url = null,
  } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Title is required." });
  }

  const courseSlug = makeSlug(slug || title);

  if (!courseSlug) {
    return res.status(400).json({ message: "Valid slug is required." });
  }

  const { rows } = await pool.query(
    `INSERT INTO courses
       (title, slug, description, category, thumbnail_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      title.trim(),
      courseSlug,
      description,
      category,
      thumbnail_url,
    ]
  );

  res.status(201).json({
    message: "Course created successfully.",
    course: rows[0],
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    description,
    category,
    thumbnail_url,
    status,
  } = req.body;

  if (status !== undefined && !validStatus(status)) {
    return res.status(400).json({ message: "Invalid course status." });
  }

  const existing = await pool.query(
    "SELECT * FROM courses WHERE id = $1",
    [id]
  );

  if (!existing.rows.length) {
    return res.status(404).json({ message: "Course not found." });
  }

  const old = existing.rows[0];

  const { rows } = await pool.query(
    `UPDATE courses
     SET title = $1,
         slug = $2,
         description = $3,
         category = $4,
         thumbnail_url = $5,
         status = $6,
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [
      title === undefined ? old.title : title.trim(),
      slug === undefined ? old.slug : makeSlug(slug),
      description ?? old.description,
      category ?? old.category,
      thumbnail_url === undefined ? old.thumbnail_url : thumbnail_url,
      status ?? old.status,
      id,
    ]
  );

  res.json({ message: "Course updated.", course: rows[0] });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query(
    "DELETE FROM courses WHERE id = $1",
    [req.params.id]
  );

  if (!rowCount) {
    return res.status(404).json({ message: "Course not found." });
  }

  res.json({ message: "Course deleted successfully." });
});

export const getCourseLessons = asyncHandler(async (req, res) => {
  const { rows: courses } = await pool.query(
    "SELECT id FROM courses WHERE id = $1",
    [req.params.id]
  );

  if (!courses.length) {
    return res.status(404).json({ message: "Course not found." });
  }

  const { rows } = await pool.query(
    `SELECT * FROM lessons
     WHERE course_id = $1
     ORDER BY position ASC`,
    [req.params.id]
  );

  res.json({ lessons: rows });
});

export const createLesson = asyncHandler(async (req, res) => {
  const { id: courseId } = req.params;
  const {
    title,
    slug,
    content = "",
    position,
  } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Lesson title is required." });
  }

  const { rows: courses } = await pool.query(
    "SELECT id FROM courses WHERE id = $1",
    [courseId]
  );

  if (!courses.length) {
    return res.status(404).json({ message: "Course not found." });
  }

  const { rows: positions } = await pool.query(
    "SELECT COALESCE(MAX(position), 0) + 1 AS next_position FROM lessons WHERE course_id = $1",
    [courseId]
  );

  const lessonSlug = makeSlug(slug || title);
  const lessonPosition = position ?? positions[0].next_position;

  const { rows } = await pool.query(
    `INSERT INTO lessons (course_id, title, slug, content, position)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [courseId, title.trim(), lessonSlug, content, lessonPosition]
  );

  res.status(201).json({
    message: "Lesson created successfully.",
    lesson: rows[0],
  });
});

export const updateLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, position, status } = req.body;

  if (status !== undefined && !validStatus(status)) {
    return res.status(400).json({ message: "Invalid lesson status." });
  }

  const { rows: existing } = await pool.query(
    "SELECT * FROM lessons WHERE id = $1",
    [id]
  );

  if (!existing.length) {
    return res.status(404).json({ message: "Lesson not found." });
  }

  const old = existing[0];

  const { rows } = await pool.query(
    `UPDATE lessons
     SET title = $1,
         slug = $2,
         content = $3,
         position = $4,
         status = $5,
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [
      title === undefined ? old.title : title.trim(),
      slug === undefined ? old.slug : makeSlug(slug),
      content ?? old.content,
      position ?? old.position,
      status ?? old.status,
      id,
    ]
  );

  res.json({ message: "Lesson updated.", lesson: rows[0] });
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query(
    "DELETE FROM lessons WHERE id = $1",
    [req.params.id]
  );

  if (!rowCount) {
    return res.status(404).json({ message: "Lesson not found." });
  }

  res.json({ message: "Lesson deleted successfully." });
});
