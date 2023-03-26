import { Request, Response } from "express";
import { prismaMock } from "../../lib/prisma/singleton";
import { createTodo } from "./todosController";

describe("createTodo", () => {
  const todos = [
    {
      id: "1",
      title: "Test todo",
      dueDate: "2023-03-20",
      userId: "123",
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  beforeEach(() => {
    prismaMock.todo.create.mockResolvedValue(todos[0]);
    prismaMock.todo.findMany.mockResolvedValue(todos);
  });
  test("creates a todo and returns all todos", async () => {
    const req = {
      body: {
        id: "12345",
        title: "Test todo",
        dueDate: "today",
      },
    } as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    await createTodo(req, res);

    // PrismaClientのcreateメソッドが正しい引数で呼ばれたか確認
    expect(prismaMock.todo.create).toHaveBeenCalledWith({
      data: {
        id: expect.any(String), // UUIDがランダムなので、any(String)で型だけチェック
        title: req.body.title,
        dueDate: req.body.dueDate,
        userId: "123",
      },
    });

    // PrismaClientのfindManyメソッドが呼ばれたか確認
    expect(prismaMock.todo.findMany).toHaveBeenCalled();

    // res.jsonが正しい引数で呼ばれたか確認
    expect(res.json).toHaveBeenCalledWith(todos);
  });
});
