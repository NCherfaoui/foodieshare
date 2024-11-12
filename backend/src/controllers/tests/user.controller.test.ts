import request from "supertest";
// Importer l'application après la configuration de l'environnement
import app from "../../index";
import jwt from "jsonwebtoken";

describe("User Controller", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@test.com`,
        password: "password123",
      })
      .expect(201);
    
    token = registerResponse.body.token;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    userId = decoded.id;
  });

  describe("GET /api/users/:id/profile", () => {
    it("should return user profile when authenticated", async () => {
      const response = await request(app)
        .get(`/api/users/${userId}/profile`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.username).toBeDefined();
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update user profile", async () => {
      const newUsername = `updated_username_${Date.now()}`;
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: newUsername,
        })
        .expect(200);
      
      expect(response.body.username).toBe(newUsername);
    });
  });
});
