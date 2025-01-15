import react from "react";
import { z } from "zod";
export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "User name must be at least 3 characters")
    .max(20, "User name must be at least 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "user name must not have special characters"),
  email: z.string().email({ message: "invalid email address" }),

  password: z.string().min(4, "Password must be at least 4 characters"),
});
