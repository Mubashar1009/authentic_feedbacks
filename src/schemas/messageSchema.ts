import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(10, "Message should be at least 10 characters")
    .max(30, "Message should be at least 30 characters"),
});
