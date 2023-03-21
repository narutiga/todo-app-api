import { NextFunction, Request, Response } from "express";

const isUserAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.locals.user === undefined) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
};

export default isUserAuthenticated;
