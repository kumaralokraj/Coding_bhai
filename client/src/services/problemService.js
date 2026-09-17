import api from "./api.js";

const problemService = {
  // Get all problems
  async getAllProblems(page = 1, limit = 10, difficulty = null, status = null) {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (difficulty) params.append("difficulty", difficulty);
      if (status) params.append("status", status);
      return await api.get(`/problems?${params.toString()}`);
    } catch (error) {
      throw error;
    }
  },

  // Get problem by ID
  async getProblemById(id) {
    try {
      return await api.get(`/problems/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Get test cases for a problem
  async getTestCases(problemId) {
    try {
      return await api.get(`/problems/${problemId}/test-cases`);
    } catch (error) {
      throw error;
    }
  },

  // Create new problem
  async createProblem(problemData) {
    try {
      return await api.post("/problems", problemData);
    } catch (error) {
      throw error;
    }
  },

  // Update problem
  async updateProblem(id, problemData) {
    try {
      return await api.put(`/problems/${id}`, problemData);
    } catch (error) {
      throw error;
    }
  },

  // Delete problem
  async deleteProblem(id) {
    try {
      return await api.delete(`/problems/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Add test case to problem
  async addTestCase(problemId, input, output) {
    try {
      return await api.post(`/problems/${problemId}/test-cases`, {
        input,
        output,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default problemService;
