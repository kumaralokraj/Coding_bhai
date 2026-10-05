import {
  getProblems,
  getProblemById,
} from "../services/problemService.js";


// ================= GET ALL =================

export const getAllProblems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      category,
      search,
    } = req.query;

    const data = await getProblems({
      page: Number(page),
      limit: Number(limit),
      difficulty,
      category,
      search,
    });

    res.status(200).json(data);

  } catch (error) {
    console.error("GET PROBLEMS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch problems",
    });
  }
};


// ================= GET SINGLE =================

export const getSingleProblem = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching problem ID:", id);

    const problem = await getProblemById(id);

    res.status(200).json({
      problem,
    });

  } catch (error) {
    console.error("GET SINGLE PROBLEM ERROR:", error);

    if (error.message === "Problem not found") {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.status(500).json({
      message: "Failed to fetch problem",
    });
  }
};