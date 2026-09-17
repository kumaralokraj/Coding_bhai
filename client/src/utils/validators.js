// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - minimum 6 characters
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Username validation
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

// Code validation
export const validateCode = (code) => {
  return code && code.trim().length > 0;
};

// Problem title validation
export const validateProblemTitle = (title) => {
  return title && title.trim().length >= 3 && title.trim().length <= 255;
};

// Problem description validation
export const validateProblemDescription = (description) => {
  return description && description.trim().length >= 10;
};

// Difficulty level validation
export const validateDifficulty = (difficulty) => {
  const validDifficulties = ["easy", "medium", "hard"];
  return validDifficulties.includes(difficulty);
};

// Language validation
export const validateLanguage = (language) => {
  const validLanguages = ["javascript", "python", "java", "cpp", "csharp"];
  return validLanguages.includes(language.toLowerCase());
};

// Contest title validation
export const validateContestTitle = (title) => {
  return title && title.trim().length >= 3;
};

// Date validation
export const validateDate = (date) => {
  return new Date(date) instanceof Date && !isNaN(new Date(date));
};

// Category validation
export const validateCategory = (category) => {
  const validCategories = ["arrays", "strings", "trees", "graphs", "dp", "sorting", "searching"];
  return validCategories.includes(category.toLowerCase());
};

// Test case validation
export const validateTestCase = (input, output) => {
  return input && input.trim().length > 0 && output && output.trim().length > 0;
};

// Validate auth form
export const validateAuthForm = (email, password, name = null) => {
  const errors = {};

  if (!validateEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!validatePassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  if (name && !validateUsername(name)) {
    errors.name = "Name must be 3-20 characters, alphanumeric or underscore/dash";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate problem form
export const validateProblemForm = (title, description, difficulty, category) => {
  const errors = {};

  if (!validateProblemTitle(title)) {
    errors.title = "Title must be 3-255 characters";
  }

  if (!validateProblemDescription(description)) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!validateDifficulty(difficulty)) {
    errors.difficulty = "Invalid difficulty level";
  }

  if (!validateCategory(category)) {
    errors.category = "Invalid category";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate submission form
export const validateSubmissionForm = (code, language) => {
  const errors = {};

  if (!validateCode(code)) {
    errors.code = "Code cannot be empty";
  }

  if (!validateLanguage(language)) {
    errors.language = "Invalid programming language";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
