import api from "./api.js";

const contestService = {
  // Get all contests
  async getAllContests(page = 1, limit = 10, status = null) {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (status) params.append("status", status);
      return await api.get(`/contests?${params.toString()}`);
    } catch (error) {
      throw error;
    }
  },

  // Get contest by ID
  async getContestById(id) {
    try {
      return await api.get(`/contests/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Get contest problems
  async getContestProblems(contestId) {
    try {
      return await api.get(`/contests/${contestId}/problems`);
    } catch (error) {
      throw error;
    }
  },

  // Get contest leaderboard
  async getContestLeaderboard(contestId) {
    try {
      return await api.get(`/contests/${contestId}/leaderboard`);
    } catch (error) {
      throw error;
    }
  },

  // Create contest
  async createContest(contestData) {
    try {
      return await api.post("/contests", contestData);
    } catch (error) {
      throw error;
    }
  },

  // Update contest
  async updateContest(id, contestData) {
    try {
      return await api.put(`/contests/${id}`, contestData);
    } catch (error) {
      throw error;
    }
  },

  // Delete contest
  async deleteContest(id) {
    try {
      return await api.delete(`/contests/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Join contest
  async joinContest(contestId) {
    try {
      return await api.post(`/contests/${contestId}/join`, {});
    } catch (error) {
      throw error;
    }
  },

  // Leave contest
  async leaveContest(contestId) {
    try {
      return await api.post(`/contests/${contestId}/leave`, {});
    } catch (error) {
      throw error;
    }
  },
};

export default contestService;
