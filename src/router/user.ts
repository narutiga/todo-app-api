import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  if (!res.locals.user) {
    res.send(undefined);
  } else {
    res.send({
      displayName: res.locals.user.displayName,
      image: res.locals.user.image,
    });
  }
});

export default router;
