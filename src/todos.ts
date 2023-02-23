import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

const prisma = new PrismaClient();

router
  .route("/")
  .get(async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    return res.json(todos);
  })
  .post(async (req: Request, res: Response) => {
    const { title } = req.body;
    const todo = await prisma.todo.create({
      data: {
        id: "123",
        title: "test",
        user_id: "123",
      },
    });
    res.json(todo);
  });

router
  .route("/:id")
  .get(async (req: Request, res: Response) => {
    const id = req.params.id;
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    return res.json(todo);
  })
  .put(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title } = req.body;
    const todo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });
    return res.json(todo);
  })
  .delete(async (req: Request, res: Response) => {
    const id = req.params.id;
    const todo = await prisma.todo.delete({
      where: {
        id,
      },
    });
    return res.json({ message: "Todo deleted" });
  });

module.exports = router;
