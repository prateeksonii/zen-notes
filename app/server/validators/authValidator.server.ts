import { z } from "zod";

export const signUpValidator = z.object({
  name: z.string().min(3, "Name must be more than 3 characters long."),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be more than 4 characters long."),
});

export const signInValidator = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});
