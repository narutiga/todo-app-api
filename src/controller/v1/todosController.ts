import { Request, Response } from "express";
import prisma from "../../lib/prisma/client";

type CreateTodoRequestBody = {
  id: string;
  title: string;
  dueDate: string;
};

export const getTodos = async (req: Request, res: Response) => {
  if (res.locals.user === undefined) {
    return res.json([]);
  } else {
    const userId = res.locals.user.id;
    const dueDate = req.query.dueDate;
    try {
      const todos = await prisma.todo.findMany({
        where: {
          userId,
          dueDate: dueDate as string,
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          isDone: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      return res.json(todos);
    } catch (error) {
      console.error("Error getting todos: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const { id, title, dueDate } = req.body as CreateTodoRequestBody;
  const userId = res.locals.user.id;
  try {
    const newTodo = await prisma.todo.create({
      data: {
        id,
        title,
        dueDate,
        userId,
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        isDone: true,
        updatedAt: true,
      },
    });
    return res.json(newTodo);
  } catch (error) {
    console.error("Error creating todo: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getTodo = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        isDone: true,
        updatedAt: true,
      },
    });
    return res.json(todo);
  } catch (error) {
    console.error("Error getting todo: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, dueDate, isDone } = req.body;
  try {
    const todo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
        dueDate,
        isDone,
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        isDone: true,
        updatedAt: true,
      },
    });
    return res.json(todo);
  } catch (error) {
    console.error("Error updating todo: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const changeTodoDueDate = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { dueDate } = req.body;
  try {
    const todo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        dueDate,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        isDone: true,
        updatedAt: true,
      },
    });
    return res.json(todo);
  } catch (error) {
    console.error("Error updating todo: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await prisma.todo.delete({
      where: {
        id,
      },
    });
    return res.json({ message: "Todo deleted" });
  } catch (error) {
    console.error("Error deleting todo: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
