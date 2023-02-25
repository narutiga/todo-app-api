import request from "supertest";
import app from "../app";
import prisma from "../lib/db";

describe("Todos API", () => {
  beforeEach(async () => {
    await prisma.todo.create({
      data: {
        id: "53456b71-b111-4278-ac34-9243620e2ac5",
        title: "ナルガとティガを抱っこする",
        user_id: "123",
      },
    });
  });

  afterEach(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should return a list of todos", async () => {
    const response = await request(app).get("/api/todos");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("ナルガとティガを抱っこする");
  });

  test("should create a new todo", async () => {
    const response = await request(app).post("/api/todos").send({
      title: "ナルガにごはんをあげる",
    });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ナルガにごはんをあげる");
  });

  test("should get a todo by id", async () => {
    const response = await request(app).get(
      "/api/todos/53456b71-b111-4278-ac34-9243620e2ac5"
    );
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ナルガとティガを抱っこする");
  });

  test("should update a todo", async () => {
    const response = await request(app)
      .put("/api/todos/53456b71-b111-4278-ac34-9243620e2ac5")
      .send({
        title: "ティガと遊ぶ",
      });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ティガと遊ぶ");
  });

  test("should delete a todo", async () => {
    const response = await request(app).delete(
      "/api/todos/53456b71-b111-4278-ac34-9243620e2ac5"
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Todo deleted");
  });
});
