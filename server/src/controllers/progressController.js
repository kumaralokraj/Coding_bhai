import { getUserProgress } from "../services/progressService.js";

export const getProgress = async (req, res) => {
  try {
    const progress = await getUserProgress(req.userId);

    return res.status(200).json({
      success: true,
      ...progress,
    });
  } catch (error) {
    console.error("Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
};
