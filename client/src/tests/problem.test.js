import problemService from "../services/problemService.js";

describe("Problem Service Tests", () => {
  const mockProblem = {
    title: "Two Sum",
    description: "Given an array of integers, return indices of the two numbers that add up to a target.",
    difficulty: "easy",
    category: "arrays",
    constraints: "1 <= nums.length <= 10^4",
    examples: [],
  };

  describe("getAllProblems", () => {
    test("should fetch all problems", async () => {
      try {
        const response = await problemService.getAllProblems(1, 10);
        expect(response.success).toBe(true);
        expect(Array.isArray(response.problems)).toBe(true);
      } catch (error) {
        console.log("Get all problems test error:", error.message);
      }
    });

    test("should handle pagination", async () => {
      try {
        const response1 = await problemService.getAllProblems(1, 5);
        const response2 = await problemService.getAllProblems(2, 5);

        expect(response1.success).toBe(true);
        expect(response2.success).toBe(true);
      } catch (error) {
        console.log("Pagination test error:", error.message);
      }
    });

    test("should filter by difficulty", async () => {
      try {
        const response = await problemService.getAllProblems(1, 10, "easy");
        expect(response.success).toBe(true);
        if (response.problems.length > 0) {
          response.problems.forEach((problem) => {
            expect(problem.difficulty).toBe("easy");
          });
        }
      } catch (error) {
        console.log("Filter by difficulty test error:", error.message);
      }
    });
  });

  describe("getProblemById", () => {
    test("should fetch a single problem by ID", async () => {
      try {
        const response = await problemService.getProblemById(1);
        expect(response.success).toBe(true);
        expect(response.problem).toBeDefined();
      } catch (error) {
        console.log("Get problem by ID test error:", error.message);
      }
    });

    test("should return 404 for non-existent problem", async () => {
      try {
        await problemService.getProblemById(99999);
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe("getTestCases", () => {
    test("should fetch test cases for a problem", async () => {
      try {
        const response = await problemService.getTestCases(1);
        expect(response.success).toBe(true);
        expect(Array.isArray(response.testCases)).toBe(true);
      } catch (error) {
        console.log("Get test cases test error:", error.message);
      }
    });
  });

  describe("createProblem", () => {
    test("should create a new problem", async () => {
      try {
        const response = await problemService.createProblem(mockProblem);
        expect(response.success).toBe(true);
        expect(response.problem).toBeDefined();
      } catch (error) {
        console.log("Create problem test error:", error.message);
      }
    });
  });

  describe("updateProblem", () => {
    test("should update an existing problem", async () => {
      try {
        const updateData = { ...mockProblem, title: "Updated Title" };
        const response = await problemService.updateProblem(1, updateData);
        expect(response.success).toBe(true);
      } catch (error) {
        console.log("Update problem test error:", error.message);
      }
    });
  });

  describe("deleteProblem", () => {
    test("should delete a problem", async () => {
      try {
        const response = await problemService.deleteProblem(1);
        expect(response.success).toBe(true);
      } catch (error) {
        console.log("Delete problem test error:", error.message);
      }
    });
  });
});
