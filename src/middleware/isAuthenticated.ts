import { NextFunction, Request, Response } from "express";
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return next();
  }
  res.redirect("/login");
};

module.exports = isAuthenticated;

export default isAuthenticated;
