import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import logger from "./lib/winston/logger";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});
app.use("/api/v1/todos", require("./router/todos"));

export default app;
