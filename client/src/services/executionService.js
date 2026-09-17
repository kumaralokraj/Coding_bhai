import api from "./api.js";

const submissionService = {
  // Submit solution
  async submitSolution(problemId, code, language) {
    try {
      return await api.post("/submissions", {
        problemId,
        code,
        language,
      });
    } catch (error) {
      throw error;
    }
  },

  // Get user submissions
  async getUserSubmissions(page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      return await api.get(`/submissions?${params.toString()}`);
    } catch (error) {
      throw error;
    }
  },

  // Get submission by ID
  async getSubmissionById(id) {
    try {
      return await api.get(`/submissions/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Get problem submissions
  async getProblemSubmissions(problemId) {
    try {
      return await api.get(`/submissions/problem/${problemId}`);
    } catch (error) {
      throw error;
    }
  },

  // Update submission
  async updateSubmission(id, code, language) {
    try {
      return await api.put(`/submissions/${id}`, {
        code,
        language,
      });
    } catch (error) {
      throw error;
    }
  },

  // Delete submission
  async deleteSubmission(id) {
    try {
      return await api.delete(`/submissions/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default submissionService;
