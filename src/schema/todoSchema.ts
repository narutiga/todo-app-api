import { z } from "zod";

const todoSchema = z
  .object({
    is_done: z.boolean(),
    dueDate: z.enum(["today", "tomorrow", "later"]),
    title: z.string().min(1).max(191),
  })
  .partial({ is_done: true });

export default todoSchema;
