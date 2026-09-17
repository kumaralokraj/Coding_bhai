import {
  validateEmail,
  validatePassword,
  validateCode,
  validateDifficulty,
  validateLanguage,
  validateAuthForm,
  validateSubmissionForm,
} from "../utils/validators.js";

describe("Validators Tests", () => {
  describe("validateEmail", () => {
    test("should validate correct email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    test("should reject invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    test("should validate password with 6+ characters", () => {
      expect(validatePassword("password123")).toBe(true);
      expect(validatePassword("123456")).toBe(true);
    });

    test("should reject password with less than 6 characters", () => {
      expect(validatePassword("12345")).toBe(false);
      expect(validatePassword("")).toBe(false);
      expect(validatePassword(null)).toBe(false);
    });
  });

  describe("validateCode", () => {
    test("should validate non-empty code", () => {
      expect(validateCode("console.log('hello')")).toBe(true);
    });

    test("should reject empty code", () => {
      expect(validateCode("")).toBe(false);
      expect(validateCode("   ")).toBe(false);
      expect(validateCode(null)).toBe(false);
    });
  });

  describe("validateDifficulty", () => {
    test("should validate correct difficulty levels", () => {
      expect(validateDifficulty("easy")).toBe(true);
      expect(validateDifficulty("medium")).toBe(true);
      expect(validateDifficulty("hard")).toBe(true);
    });

    test("should reject invalid difficulty levels", () => {
      expect(validateDifficulty("simple")).toBe(false);
      expect(validateDifficulty("extreme")).toBe(false);
    });
  });

  describe("validateLanguage", () => {
    test("should validate supported programming languages", () => {
      expect(validateLanguage("javascript")).toBe(true);
      expect(validateLanguage("python")).toBe(true);
      expect(validateLanguage("java")).toBe(true);
    });

    test("should reject unsupported languages", () => {
      expect(validateLanguage("rust")).toBe(false);
      expect(validateLanguage("go")).toBe(false);
    });
  });

  describe("validateAuthForm", () => {
    test("should validate complete auth form", () => {
      const result = validateAuthForm("test@example.com", "password123", "testuser");
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    test("should return errors for invalid form", () => {
      const result = validateAuthForm("invalid-email", "123", "testuser");
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });
  });

  describe("validateSubmissionForm", () => {
    test("should validate complete submission form", () => {
      const result = validateSubmissionForm("console.log('hello')", "javascript");
      expect(result.isValid).toBe(true);
    });

    test("should return errors for invalid submission", () => {
      const result = validateSubmissionForm("", "unsupported");
      expect(result.isValid).toBe(false);
      expect(result.errors.code).toBeDefined();
      expect(result.errors.language).toBeDefined();
    });
  });
});
