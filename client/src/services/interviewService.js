import api from "./api.js";

const interviewService = {
  // Get interview questions
  async getInterviewQuestions(difficulty = null, topic = null, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      if (difficulty) params.append("difficulty", difficulty);
      if (topic) params.append("topic", topic);
      params.append("page", page);
      params.append("limit", limit);
      return await api.get(`/interviews/questions?${params.toString()}`);
    } catch (error) {
      throw error;
    }
  },

  // Get question by ID
  async getQuestionById(id) {
    try {
      return await api.get(`/interviews/questions/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Start interview session
  async startInterview(difficulty) {
    try {
      return await api.post("/interviews", { difficulty });
    } catch (error) {
      throw error;
    }
  },

  // Get interview session
  async getInterviewSession(id) {
    try {
      return await api.get(`/interviews/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Update interview session
  async updateInterviewSession(id, updateData) {
    try {
      return await api.put(`/interviews/${id}`, updateData);
    } catch (error) {
      throw error;
    }
  },

  // Submit interview
  async submitInterview(id, answers) {
    try {
      return await api.post(`/interviews/${id}/submit`, { answers });
    } catch (error) {
      throw error;
    }
  },

  // Get user interviews
  async getUserInterviews(page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      return await api.get(`/interviews/my-sessions?${params.toString()}`);
    } catch (error) {
      throw error;
    }
  },
};

export default interviewService;
