import { z } from "zod";

const todoSchema = z.object({
  title: z.string().min(1).max(191),
  is_done: z.boolean(),
  is_priority: z.boolean(),
});

export default todoSchema;
