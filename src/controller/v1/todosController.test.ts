import { Request, Response } from "express";
import supertest from "supertest";
import express, { NextFunction } from "express";
import { prismaMock } from "./../../lib/prisma/singleton";
import { getTodos } from "./todosController";
import { client } from "../../app";

const app = express();
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.user = undefined;
  next();
});
app.get("/api/v1/todos", getTodos);

describe("GET /api/v1/todos", () => {
  test("should return an empty array if no user ID is provided", async () => {
    prismaMock.todo.findMany.mockResolvedValue([]);

    const response = await supertest(app).get("/api/v1/todos");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(prismaMock.todo.findMany).not.toHaveBeenCalled();
  });
});

afterAll(async () => {
  await prismaMock.$disconnect();
  client.quit();
});
