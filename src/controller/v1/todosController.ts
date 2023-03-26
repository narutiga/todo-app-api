import { Request, Response } from "express";
import prisma from "../../lib/prisma/client";
export const getTodos = async (req: Request, res: Response) => {
  if (res.locals.user === undefined) {
    return res.json([]);
  } else {
    const userId = res.locals.user.id;
    const dueDate = req.query.dueDate;
    const todos = await prisma.todo.findMany({
      where: {
        userId,
        dueDate: dueDate as string,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    return res.json(todos);
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const { id, title, dueDate } = req.body;
  const userId = res.locals.user.id;
  await prisma.todo.create({
    data: {
      id,
      title,
      dueDate,
      userId,
    },
  });
  const todos = await prisma.todo.findMany();
  return res.json(todos);
};

export const getTodo = async (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });
  return res.json(todo);
};

export const updateTodo = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, dueDate, isDone } = req.body;
  await prisma.todo.update({
    where: {
      id,
    },
    data: {
      title,
      dueDate,
      isDone,
    },
  });
  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });
  return res.json(todo);
};

export const changeTodoDueDate = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { dueDate } = req.body;
  await prisma.todo.update({
    where: {
      id,
    },
    data: {
      dueDate,
      updatedAt: new Date(),
    },
  });
  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });
  return res.json(todo);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.id;

  await prisma.todo.delete({
    where: {
      id,
    },
  });

  return res.json({ message: "Todo deleted" });
};
