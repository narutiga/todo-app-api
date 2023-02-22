import express, { Request, Response } from "express";

const router = express.Router();

router.route("/").get(async (req: Request, res: Response) => {
  res.send("This is TODO router with GET request method");
});

module.exports = router;
