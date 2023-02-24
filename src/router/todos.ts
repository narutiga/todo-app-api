import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controller/todosController";

const router = express.Router();

router.route("/").get(getTodos).post(createTodo);

router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

module.exports = router;
