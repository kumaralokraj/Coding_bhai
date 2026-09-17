import api from "./api.js";

const leaderboardService = {
  // Get global leaderboard
  async getGlobalLeaderboard(page = 1, limit = 50) {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      return await api.get(`/leaderboard?${params.toString()}`);
    } catch (error) {
      throw error;
    }
  },

  // Get contest leaderboard
  async getContestLeaderboard(contestId) {
    try {
      return await api.get(`/leaderboard/contest/${contestId}`);
    } catch (error) {
      throw error;
    }
  },

  // Get user rank
  async getUserRank(userId) {
    try {
      return await api.get(`/leaderboard/user/${userId}`);
    } catch (error) {
      throw error;
    }
  },

  // Get user stats
  async getUserStats() {
    try {
      return await api.get(`/leaderboard/stats`);
    } catch (error) {
      throw error;
    }
  },

  // Refresh leaderboard
  async refreshLeaderboard() {
    try {
      return await api.post(`/leaderboard/refresh`, {});
    } catch (error) {
      throw error;
    }
  },
};

export default leaderboardService;
