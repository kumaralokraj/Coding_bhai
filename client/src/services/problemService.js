import api from "./api";

export const getProblems = async ({
  page = 1,
  limit = 20,
  difficulty = "",
  category = "",
  search = "",
} = {}) => {
  const response = await api.get("/problems", {
    params: {
      page,
      limit,
      difficulty,
      category,
      search,
    },
  });

  return response.data;
};

// Get single problem by ID
export const getProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};