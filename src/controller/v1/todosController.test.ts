import { prismaMock } from "../../lib/prisma/singleton";
import request from "supertest";
import app from "../../app";

describe("Todos API", () => {
  test("should return a list of todos", async () => {
    const response = await request(app).get("/api/v1/todos");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe("ナルガとティガを抱っこする");
  });

  test("should create a new todo", async () => {
    const response = await request(app).post("/api/v1/todos").send({
      title: "ナルガとティガをなでる",
    });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ナルガとティガをなでる");
  });

  test("should get a todo by id", async () => {
    const response = await request(app).get(
      "/api/v1/todos/53456b71-b111-4278-ac34-9243620e2ac7"
    );
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ナルガにごはんをあげる");
  });

  test("should update a todo", async () => {
    const response = await request(app)
      .put("/api/v1/todos/53456b71-b111-4278-ac34-9243620e2ac8")
      .send({
        title: "ナルティガの爪を切る",
      });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("ナルガとティガをなでる");
  });

  test("should delete a todo", async () => {
    const response = await request(app).delete(
      "/api/v1/todos/53456b71-b111-4278-ac34-9243620e2ac5"
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Todo deleted");
  });
});
