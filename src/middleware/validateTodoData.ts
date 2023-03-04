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
    return res.status(400).json({ message: "Invalid todo data" });
  }
  next();
};

export default validateTodoData;
