import request from "supertest";
import app from "../src/app";

describe("Auth Routes", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered");
  });

  it("should login a user and return a token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
