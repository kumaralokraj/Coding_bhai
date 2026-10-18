
import pool from "../config/db.js";

export const getPublishedCourses = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;

    const { rows } = await pool.query(
      `SELECT c.id, c.title, c.slug, c.description,
              c.category, c.thumbnail_url, c.created_at,
              COUNT(l.id)::int AS lesson_count
       FROM courses c
       LEFT JOIN lessons l
         ON l.course_id = c.id AND l.status = 'published'
       WHERE c.status = 'published'
         AND ($1 = '' OR
              c.title ILIKE '%' || $1 || '%' OR
              c.description ILIKE '%' || $1 || '%')
         AND ($2 = '' OR c.category = $2)
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [search, category]
    );

    res.json({ courses: rows });
  } catch (error) {
    console.error("Get courses error:", error.message);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};

export const getPublishedCourse = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, slug, description, category,
              thumbnail_url, created_at
       FROM courses
       WHERE slug = $1 AND status = 'published'`,
      [req.params.slug]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Course not found." });
    }

    const course = rows[0];

    const { rows: lessons } = await pool.query(
      `SELECT id, course_id, title, slug, position
       FROM lessons
       WHERE course_id = $1 AND status = 'published'
       ORDER BY position ASC`,
      [course.id]
    );

    res.json({ course: { ...course, lessons } });
  } catch (error) {
    console.error("Get course error:", error.message);
    res.status(500).json({ message: "Failed to fetch course." });
  }
};

export const getPublishedLesson = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         c.id AS course_id,
         c.title AS course_title,
         c.slug AS course_slug,
         l.id AS lesson_id,
         l.title AS lesson_title,
         l.slug AS lesson_slug,
         l.content,
         l.position
       FROM courses c
       JOIN lessons l ON l.course_id = c.id
       WHERE c.slug = $1
         AND l.slug = $2
         AND c.status = 'published'
         AND l.status = 'published'`,
      [req.params.courseSlug, req.params.lessonSlug]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    res.json({ lesson: rows[0] });
  } catch (error) {
    console.error("Get lesson error:", error.message);
    res.status(500).json({ message: "Failed to fetch lesson." });
  }
};
