import React, { createContext, useState, useCallback, useEffect } from "react";
import authService from "../services/authService.js";
import { getUser, setUser, clearUser, getToken, setToken, clearToken } from "../utils/helpers.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = getUser();
      const token = getToken();

      if (storedUser && token) {
        setUserState(storedUser);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const register = useCallback(async (email, password, name) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(email, password, name);

      if (response.user) {
        setToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(email, password);

      if (response.user) {
        setToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      clearUser();
      clearToken();
      setUserState(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authService.getProfile();
      if (response.user) {
        setUser(response.user);
        setUserState(response.user);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      if (response.token) {
        setToken(response.token);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    getProfile,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
