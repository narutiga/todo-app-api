import todoSchema from "../schema/todoSchema";
import { NextFunction, Request, Response } from "express";
import logger from "../lib/winston/logger";

const validateTodoData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = todoSchema.safeParse(req.body);
    if (!result.success) {
      logger.error("Payload validation failed");
      return res
        .status(400)
        .json({ message: "Invalid data" })
        .send(result.error);
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
  next();
};

export default validateTodoData;
