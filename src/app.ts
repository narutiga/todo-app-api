import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1/todos", require("./router/todos"));
app.use("/api/v1/auth", require("./router/auth"));

export default app;
