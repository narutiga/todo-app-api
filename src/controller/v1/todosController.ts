import { Request, Response } from "express";
import prisma from "../../lib/prisma/client";
import { v4 as uuidv4 } from "uuid";
export const getTodos = async (req: Request, res: Response) => {
  const todos = await prisma.todo.findMany();
  return res.json(todos);
};

export const createTodo = async (req: Request, res: Response) => {
  const title = req.body.title;
  const todo = await prisma.todo.create({
    data: {
      id: uuidv4(),
      title,
      user_id: "123",
    },
  });
  return res.json(todo);
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
  const { title } = req.body;
  const todo = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      title,
      updated_at: new Date(),
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
