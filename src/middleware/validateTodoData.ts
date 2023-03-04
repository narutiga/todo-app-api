import todoSchema from "../schema/todoSchema";
import { NextFunction, Request, Response } from "express";

const validateTodoData = (req: Request, res: Response, next: NextFunction) => {
  const result = todoSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid data" }).send(result.error);
  }
  next();
};

export default validateTodoData;
