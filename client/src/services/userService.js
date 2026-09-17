import api from "./api.js";

const userService = {
  // Get user profile
  async getUserProfile(userId) {
    try {
      return await api.get(`/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },

  // Get user submissions
  async getUserSubmissions(userId, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      return await api.get(`/users/${userId}/submissions?${params.toString()}`);
    } catch (error) {
      throw error;
    }
  },

  // Get user statistics
  async getUserStatistics(userId) {
    try {
      return await api.get(`/users/${userId}/statistics`);
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateProfile(name, bio) {
    try {
      return await api.put("/users/profile", { name, bio });
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(oldPassword, newPassword) {
    try {
      return await api.put("/users/password", { oldPassword, newPassword });
    } catch (error) {
      throw error;
    }
  },

  // Update preferences
  async updatePreferences(preferences) {
    try {
      return await api.put("/users/preferences", preferences);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      return await api.get("/users/me");
    } catch (error) {
      throw error;
    }
  },

  // Delete account
  async deleteAccount() {
    try {
      return await api.delete("/users/account");
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
