import { NextFunction, Request, Response } from "express";

const setUserData = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    next();
  } else {
    next();
  }
};

export default setUserData;
