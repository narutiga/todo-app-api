import todoSchema from "../schema/todoSchema";
import { NextFunction, Request, Response } from "express";

const validateTodoData = (req: Request, res: Response, next: NextFunction) => {
  const todoData = {
    title: req.body.title,
    is_done: false,
    is_priority: true,
  };
  const result = todoSchema.safeParse(todoData);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  next();
};

export default validateTodoData;
