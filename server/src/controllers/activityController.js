import {
  getUserActivity,
  recordActivity,
} from "../services/ActivityServies.js";


// ==========================================
// GET ACTIVITY
// ==========================================

export const fetchActivity = async (req, res) => {
  try {
    const userId = req.userId;

    const activity = await getUserActivity(userId);

    res.status(200).json({
      success: true,
      activity,
    });

  } catch (error) {
    console.error("Activity Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
    });
  }
};


// ==========================================
// RECORD ACTIVITY
// ==========================================

export const createActivity = async (req, res) => {
  try {
    const userId = req.userId;

    const { solved = false } = req.body;

    const activity = await recordActivity(
      userId,
      solved
    );

    res.status(200).json({
      success: true,
      activity,
    });

  } catch (error) {
    console.error("Create Activity Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to record activity",
    });
  }
};