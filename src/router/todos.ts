import express from "express";
import { checkTodoExists } from "../middleware/checkTodoExists";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controller/v1/todosController";

const router = express.Router();

router.route("/").get(getTodos).post(createTodo);

router.use("/:id", checkTodoExists);
router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

module.exports = router;
