import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import User from "../src/models/user";

let userId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  const user = new User({
    username: "testuser",
    password: "password123",
  });
  const savedUser = await user.save();
  userId = savedUser._id.toString();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("User Routes", () => {
  it("should get a user by ID", async () => {
    const response = await request(app)
      .get(`/api/users/user/${userId}`)
      .set("Authorization", `Bearer ${process.env.JWT_SECRET}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("testuser");
  });
});
