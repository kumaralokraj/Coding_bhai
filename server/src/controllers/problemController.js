import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
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
// ================= ADMIN: CREATE =================

export const adminCreateProblem = async (req, res) => {
  try {
    const problem = await createProblem(req.body);

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    console.error("CREATE PROBLEM ERROR:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A problem with this slug already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create problem",
    });
  }
};


// ================= ADMIN: UPDATE =================

export const adminUpdateProblem = async (req, res) => {
  try {
    const problem = await updateProblem(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem,
    });
  } catch (error) {
    console.error("UPDATE PROBLEM ERROR:", error);

    if (error.message === "Problem not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A problem with this slug already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update problem",
    });
  }
};


// ================= ADMIN: DELETE =================

export const adminDeleteProblem = async (req, res) => {
  try {
    const problem = await deleteProblem(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
      problem,
    });
  } catch (error) {
    console.error("DELETE PROBLEM ERROR:", error);

    if (error.message === "Problem not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete problem",
    });
  }
};