import api from "./api";

export const getActivity = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.get("/activity", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};