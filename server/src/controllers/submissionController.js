import { createSubmission } from "../services/submissionService.js";

export const submitCode = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      problemId,
      language,
      code,
    } = req.body;

    const submission = await createSubmission({
      userId,
      problemId,
      language,
      code,
    });

    return res.status(201).json({
      success: true,
      message: "Code submitted successfully",
      submission,
    });

  } catch (error) {
    console.error("Submission Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Submission failed",
    });
  }
};