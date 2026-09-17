import api from "./api.js";

const authService = {
  // Register new user
  async register(email, password, name) {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
      });
      if (response.token) {
        api.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      if (response.token) {
        api.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      return await api.get("/auth/profile");
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      const response = await api.post("/auth/logout", {});
      api.clearToken();
      return response;
    } catch (error) {
      api.clearToken();
      throw error;
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post("/auth/refresh-token", {});
      if (response.token) {
        api.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!api.getToken();
  },
};

export default authService;
