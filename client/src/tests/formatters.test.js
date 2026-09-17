import {
  formatDate,
  formatDateTime,
  getDifficultyColor,
  getDifficultyBadge,
  truncateText,
  formatNumber,
  getInitials,
  getDifficultyColor as getDiffColor,
} from "../utils/formatters.js";

describe("Formatters Tests", () => {
  describe("formatDate", () => {
    test("should format date correctly", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date);
      expect(formatted).toContain("January");
      expect(formatted).toContain("2024");
    });
  });

  describe("formatDateTime", () => {
    test("should format date and time correctly", () => {
      const date = new Date("2024-01-15T10:30:00");
      const formatted = formatDateTime(date);
      expect(formatted).toContain("January");
      expect(formatted).toContain("2024");
      expect(formatted).toContain("10");
    });
  });

  describe("getDifficultyColor", () => {
    test("should return correct color for each difficulty", () => {
      expect(getDifficultyColor("easy")).toBe("text-green-500");
      expect(getDifficultyColor("medium")).toBe("text-yellow-500");
      expect(getDifficultyColor("hard")).toBe("text-red-500");
    });

    test("should return default color for unknown difficulty", () => {
      expect(getDifficultyColor("unknown")).toBe("text-gray-500");
    });
  });

  describe("getDifficultyBadge", () => {
    test("should return correct badge class for each difficulty", () => {
      expect(getDifficultyBadge("easy")).toContain("green");
      expect(getDifficultyBadge("medium")).toContain("yellow");
      expect(getDifficultyBadge("hard")).toContain("red");
    });
  });

  describe("truncateText", () => {
    test("should truncate text longer than max length", () => {
      const longText = "This is a very long text that should be truncated";
      const truncated = truncateText(longText, 10);
      expect(truncated).toContain("...");
      expect(truncated.length).toBeLessThanOrEqual(13); // 10 + "..."
    });

    test("should not truncate text shorter than max length", () => {
      const shortText = "Short text";
      const truncated = truncateText(shortText, 20);
      expect(truncated).toBe(shortText);
    });
  });

  describe("formatNumber", () => {
    test("should format numbers with commas", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1000000)).toBe("1,000,000");
    });

    test("should handle small numbers", () => {
      expect(formatNumber(100)).toBe("100");
      expect(formatNumber(10)).toBe("10");
    });
  });

  describe("getInitials", () => {
    test("should get correct initials from name", () => {
      expect(getInitials("John Doe")).toBe("JD");
      expect(getInitials("Alice Smith Johnson")).toBe("ASJ");
    });
  });
});
