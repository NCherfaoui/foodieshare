import request from "supertest";
import app from "../../index";
import jwt from "jsonwebtoken";

describe("Recipe Controller", () => {
  let token: string;

  beforeEach(async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        username: `recipeuser_${Date.now()}`,
        email: `recipe_${Date.now()}@test.com`,
        password: "password123",
      })
      .expect(201);
    
    token = registerResponse.body.token;
  });

  describe("GET /api/recipes", () => {
    it("should return list of recipes", async () => {
      const response = await request(app)
        .get("/api/recipes")
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should filter recipes by search term", async () => {
      const response = await request(app)
        .get("/api/recipes")
        .query({ search: "test" })
        .expect(200);
      
      expect(response.body).toBeDefined();
    });
  });

  describe("POST /api/recipes", () => {
    it("should create new recipe when authenticated", async () => {
      const uniqueTitle = `Test Recipe ${Date.now()}`;
      const response = await request(app)
        .post("/api/recipes")
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: uniqueTitle,
          ingredients: ["ingredient 1", "ingredient 2"],
          steps: ["step 1"],
        })
        .expect(201);
      
      expect(response.body.recipe.title).toBe(uniqueTitle);
    });
  });
});
