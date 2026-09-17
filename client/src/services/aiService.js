import api from "./api.js";

const aiService = {
  // Generate hint for problem
  async generateHint(problemId) {
    try {
      return await api.post("/ai/generate-hint", { problemId });
    } catch (error) {
      throw error;
    }
  },

  // Get problem solution
  async solveProblem(problemId) {
    try {
      return await api.post("/ai/solve-problem", { problemId });
    } catch (error) {
      throw error;
    }
  },

  // Analyze code
  async analyzeCode(code, language) {
    try {
      return await api.post("/ai/analyze-code", { code, language });
    } catch (error) {
      throw error;
    }
  },

  // Generate explanation
  async generateExplanation(problemId) {
    try {
      return await api.post("/ai/generate-explanation", { problemId });
    } catch (error) {
      throw error;
    }
  },

  // Get code suggestions
  async getCodeSuggestions(problemId) {
    try {
      return await api.get(`/ai/suggestions/${problemId}`);
    } catch (error) {
      throw error;
    }
  },
};

export default aiService;
