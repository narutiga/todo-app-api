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
          is_done: false,
          priority: "high",
          user_id: "123",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "53456b71-b111-4278-ac34-9243620e2ac6",
          title: "ナルガにごはんをあげる",
          is_done: false,
          priority: "high",
          user_id: "123",
          created_at: new Date(),
          updated_at: new Date(),
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
        is_done: false,
        priority: "high",
        user_id: "123",
        created_at: new Date(),
        updated_at: new Date(),
      };
      const dummyTodos = [
        {
          id: "53456b71-b111-4278-ac34-9243620e2ac5",
          title: "ナルガとティガを抱っこする",
          is_done: false,
          priority: "high",
          user_id: "123",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "53456b71-b111-4278-ac34-9243620e2ac6",
          title: "ナルガにごはんをあげる",
          is_done: false,
          priority: "high",
          user_id: "123",
          created_at: new Date(),
          updated_at: new Date(),
        },
        dummyTodo,
      ];

      prismaMock.todo.create.mockResolvedValue(dummyTodo);
      prismaMock.todo.findMany.mockResolvedValue(dummyTodos);
    });

    test("should create a new todo", async () => {
      const response = await request(app)
        .post("/api/v1/todos")
        .send({ priority: "high", title: "ナルガとティガをなでる" });

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
      is_done: false,
      priority: "high",
      user_id: "123",
      created_at: new Date(),
      updated_at: new Date(),
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
            priority: "high",
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
