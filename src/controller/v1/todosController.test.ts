import { prismaMock } from "../../lib/singleton";
import request from "supertest";
import app from "../../app";

describe("Todos API", () => {
  beforeEach(() => {
    const dummyTodos = [
      {
        id: "53456b71-b111-4278-ac34-9243620e2ac5",
        title: "ナルガとティガを抱っこする",
        is_done: false,
        is_priority: true,
        user_id: "123",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "53456b71-b111-4278-ac34-9243620e2ac6",
        title: "ナルガにごはんをあげる",
        is_done: false,
        is_priority: true,
        user_id: "123",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const dummyTodo = {
      id: "53456b71-b111-4278-ac34-9243620e2ac7",
      title: "ナルガとティガをなでる",
      is_done: false,
      is_priority: true,
      user_id: "123",
      created_at: new Date(),
      updated_at: new Date(),
    };

    prismaMock.todo.findMany.mockResolvedValue(dummyTodos);
    prismaMock.todo.create.mockResolvedValue(dummyTodo);
    prismaMock.todo.findUnique.mockResolvedValue(dummyTodos[1]);
    prismaMock.todo.update.mockResolvedValue(dummyTodo);
    prismaMock.todo.delete.mockResolvedValue(dummyTodo);
  });

  test("should return a list of todos", async () => {
    const response = await request(app).get("/api/todos");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe("ナルガとティガを抱っこする");
  });

  test("should create a new todo", async () => {
    const response = await request(app).post("/api/todos").send({
      title: "ナルガとティガをなでる",
    });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ナルガとティガをなでる");
  });

  test("should get a todo by id", async () => {
    const response = await request(app).get(
      "/api/todos/53456b71-b111-4278-ac34-9243620e2ac7"
    );
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ナルガにごはんをあげる");
  });

  test("should update a todo", async () => {
    const response = await request(app)
      .put("/api/todos/53456b71-b111-4278-ac34-9243620e2ac8")
      .send({
        title: "ナルティガの爪を切る",
      });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ナルガとティガをなでる");
  });

  test("should delete a todo", async () => {
    const response = await request(app).delete(
      "/api/todos/53456b71-b111-4278-ac34-9243620e2ac5"
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Todo deleted");
  });
});
