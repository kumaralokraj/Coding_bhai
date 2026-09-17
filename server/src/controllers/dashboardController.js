import { getDashboardData } from "../services/dashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const dashboardData = await getDashboardData(userId);

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};