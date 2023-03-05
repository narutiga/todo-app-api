import { NextFunction, Request, Response } from "express";
import logger from "../lib/winston/logger";
import prisma from "../lib/prisma/client";

export const checkTodoExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const existingTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!existingTodo) {
      logger.error(`Todo with id ${id} not found`);
      return res.status(404).json({ error: "Todo not found" });
    }
    res.locals.todo = existingTodo;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
