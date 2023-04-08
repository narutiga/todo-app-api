import { prismaMock } from "../lib/prisma/singleton";
import request from "supertest";
import app from "../app";
import { mockReset } from "jest-mock-extended";

describe("isAuthenticated", () => {
  test("should return 401 if user is not authenticated", async () => {
    const response = await request(app).post("/api/v1/todos");
    expect(response.status).toBe(401);
  });
});
