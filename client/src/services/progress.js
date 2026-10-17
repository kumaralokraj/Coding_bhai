import api from "./api";

export const getProgress = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to view your progress.");
  }

  const response = await api.get("/progress", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
