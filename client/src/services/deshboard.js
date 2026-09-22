import api from "./api";

// Get logged-in user's dashboard data
export const getDashboard = async () => {
  const response = await api.get("/dashboard");

  return response.data;
};