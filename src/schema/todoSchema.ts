import { z } from "zod";

const todoSchema = z
  .object({
    is_done: z.boolean(),
    priority: z.enum(["low", "medium", "high"]),
    title: z.string().min(1).max(191),
  })
  .partial({ is_done: true });

export default todoSchema;
