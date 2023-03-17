import express from "express";
import { checkTodoExists } from "../middleware/checkTodoExists";
import {
  changeTodoDueDate,
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controller/v1/todosController";
import validateTodoData from "../middleware/validateTodoData";

const router = express.Router();

router.route("/").get(getTodos).post(validateTodoData, createTodo);

router.use("/:id", checkTodoExists);
router
  .route("/:id")
  .get(getTodo)
  .put(validateTodoData, updateTodo)
  .patch(changeTodoDueDate)
  .delete(deleteTodo);

module.exports = router;
