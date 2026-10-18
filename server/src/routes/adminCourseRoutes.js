
import express from "express";
import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/adminCourseController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getCourses);
router.post("/", createCourse);

router.get("/:id/lessons", getCourseLessons);
router.post("/:id/lessons", createLesson);

router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

router.put("/lessons/:id", updateLesson);
router.delete("/lessons/:id", deleteLesson);

export default router;
