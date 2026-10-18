
import express from "express";
import {
  getPublishedCourses,
  getPublishedCourse,
  getPublishedLesson,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getPublishedCourses);
router.get("/:slug/lessons/:lessonSlug", getPublishedLesson);
router.get("/:slug", getPublishedCourse);

export default router;
