import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import logger from "./lib/winston/logger";
import authRouter, { passport } from "./router/auth";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import setUserData from "./middleware/setUserData";

const app: Application = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

const RedisStore = connectRedis(session);
const url = (process.env.REDIS_URL as string) ?? "redis://localhost:6379";
const client = new Redis(url);
client.on("connect", () => {
  console.log("Redis client connected");
});
client.on("error", (err) => {
  console.log("Something went wrong " + err);
});

app.use(cors(corsOptions));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(
  session({
    store: new RedisStore({ client }),
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1/auth", authRouter);
app.use(setUserData);
app.use("/api/v1/todos", require("./router/todos"));

export default app;
