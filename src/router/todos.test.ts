import { prismaMock } from "../lib/prisma/singleton";
import request from "supertest";
import app from "../app";
import { mockReset } from "jest-mock-extended";

describe("test /api/v1/todos", () => {
  describe("GET /api/v1/todos", () => {
    beforeEach(() => {
      const dummyTodos = [
        {
          id: "53456b71-b111-4278-ac34-9243620e2ac5",
          title: "ナルガとティガを抱っこする",
          isDone: false,
          dueDate: "today",
          userId: "123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "53456b71-b111-4278-ac34-9243620e2ac6",
          title: "ナルガにごはんをあげる",
          isDone: false,
          dueDate: "today",
          userId: "123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.todo.findMany.mockResolvedValue(dummyTodos);
    });

    test("should return a list of todos", async () => {
      const response = await request(app).get("/api/v1/todos");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe("ナルガとティガを抱っこする");
    });
  });

  describe("POST /api/v1/todos", () => {
    beforeEach(() => {
      const dummyTodo = {
        id: "53456b71-b111-4278-ac34-9243620e2ac7",
        title: "ナルガとティガをなでる",
        isDone: false,
        dueDate: "today",
        userId: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const dummyTodos = [
        {
          id: "53456b71-b111-4278-ac34-9243620e2ac5",
          title: "ナルガとティガを抱っこする",
          isDone: false,
          dueDate: "today",
          userId: "123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "53456b71-b111-4278-ac34-9243620e2ac6",
          title: "ナルガにごはんをあげる",
          isDone: false,
          dueDate: "today",
          userId: "123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dummyTodo,
      ];

      prismaMock.todo.create.mockResolvedValue(dummyTodo);
      prismaMock.todo.findMany.mockResolvedValue(dummyTodos);
    });

    test("should create a new todo", async () => {
      const response = await request(app)
        .post("/api/v1/todos")
        .send({ dueDate: "today", title: "ナルガとティガをなでる" });

      expect(response.status).toBe(200);
      expect(response.body[2].title).toBe("ナルガとティガをなでる");
    });

    test("should return 400 if title is not provided", async () => {
      const response = await request(app).post("/api/v1/todos").send();

      expect(response.status).toBe(400);
    });
  });
});

describe("test /api/v1/todos/:id", () => {
  beforeEach(() => {
    const dummyTodo = {
      id: "53456b71-b111-4278-ac34-9243620e2ac5",
      title: "ナルガとティガを抱っこする",
      isDone: false,
      dueDate: "today",
      userId: "123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.todo.findUnique.mockResolvedValue(dummyTodo);
  });

  describe("GET /api/v1/todos/:id", () => {
    describe("GET /api/v1/todos/:id 200", () => {
      test("should get a todo by id", async () => {
        const response = await request(app).get(
          "/api/v1/todos/53456b71-b111-4278-ac34-9243620e2ac5"
        );
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("ナルガとティガを抱っこする");
      });

      describe("GET /api/v1/todos/:id 404", () => {
        beforeEach(() => {
          mockReset(prismaMock);
        });
        test("should return 404 if incorrect path parameter is provided", async () => {
          const response = await request(app).get("/api/v1/todos/345");
          expect(response.status).toBe(404);
        });
      });

      describe("GET /api/v1/todos/:id 500", () => {
        beforeEach(() => {
          prismaMock.todo.findUnique.mockRejectedValue(new Error("error"));
        });
        test("should return 500 if server error occurs", async () => {
          const response = await request(app).get(
            "/api/v1/todos/53456b71-b111-4278-ac34-9243620e2ac5"
          );
          expect(response.status).toBe(500);
        });
      });
    });

    describe("PUT /api/v1/todos/:id", () => {
      test("should update a todo", async () => {
        const response = await request(app)
          .put("/api/v1/todos/53456b71-b111-4278-ac34-9243620e2ac5")
          .send({
            title: "ナルガとティガを抱っこする",
            dueDate: "today",
          });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("ナルガとティガを抱っこする");
      });

      test("should return 404 if no path parameter is provided", async () => {
        const response = await request(app).put("/api/v1/todos");
        expect(response.status).toBe(404);
      });
    });

    describe("DELETE /api/v1/todos/:id", () => {
      test("should delete a todo", async () => {
        const response = await request(app).delete(
          "/api/v1/todos/53456b71-b111-4278-ac34-9243620e2ac5"
        );
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Todo deleted");
      });

      test("should return 404 if no path parameter is provided", async () => {
        const response = await request(app).delete("/api/v1/todos");
        expect(response.status).toBe(404);
      });
    });
  });
});
