import express from "express";

import {
  getAllProblems,
  getSingleProblem,
} from "../controllers/problemController.js";

const router = express.Router();


// GET ALL
router.get("/", getAllProblems);


// GET SINGLE
router.get("/:id", getSingleProblem);


export default router;