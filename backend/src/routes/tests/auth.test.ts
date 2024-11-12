import request from "supertest";
// Importer l'application après la configuration de l'environnement
import app from "../../index";

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should register new user and return a token", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: `newuser_${Date.now()}`, // Utilisez un username unique
          email: `new_${Date.now()}@test.com`, // Utilisez un email unique
          password: "password123",
        })
        .expect(201);

      expect(response.body.token).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@test.com`,
        password: "password123",
      });
    });

    it("should login existing user and return a token", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: `test_${Date.now()}@test.com`,
          password: "password123",
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
    });
  });
});
