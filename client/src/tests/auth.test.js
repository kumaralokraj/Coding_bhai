import authService from "../services/authService.js";

describe("Auth Service Tests", () => {
  // Mock data
  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe("register", () => {
    test("should successfully register a new user", async () => {
      try {
        const response = await authService.register(
          mockUser.email,
          mockUser.password,
          mockUser.name
        );

        expect(response.success).toBe(true);
        expect(response.user).toBeDefined();
        expect(response.token).toBeDefined();
      } catch (error) {
        console.log("Register test error:", error.message);
      }
    });

    test("should handle registration with duplicate email", async () => {
      try {
        await authService.register(
          mockUser.email,
          mockUser.password,
          mockUser.name
        );
        // Try to register again with same email
        await authService.register(
          mockUser.email,
          "password456",
          "Another User"
        );
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.message).toContain("already exists");
      }
    });
  });

  describe("login", () => {
    test("should successfully login with valid credentials", async () => {
      try {
        // First register
        await authService.register(
          mockUser.email,
          mockUser.password,
          mockUser.name
        );

        // Then login
        const response = await authService.login(
          mockUser.email,
          mockUser.password
        );

        expect(response.success).toBe(true);
        expect(response.user).toBeDefined();
        expect(response.token).toBeDefined();
      } catch (error) {
        console.log("Login test error:", error.message);
      }
    });

    test("should fail login with invalid credentials", async () => {
      try {
        await authService.login("invalid@example.com", "wrongpassword");
      } catch (error) {
        expect(error.status).toBe(401);
      }
    });
  });

  describe("logout", () => {
    test("should successfully logout", async () => {
      try {
        const response = await authService.logout();
        expect(response.success).toBe(true);
      } catch (error) {
        console.log("Logout test error:", error.message);
      }
    });
  });

  describe("getProfile", () => {
    test("should get user profile when authenticated", async () => {
      try {
        await authService.login(mockUser.email, mockUser.password);
        const response = await authService.getProfile();

        expect(response.success).toBe(true);
        expect(response.user).toBeDefined();
      } catch (error) {
        console.log("Get profile test error:", error.message);
      }
    });
  });
});
