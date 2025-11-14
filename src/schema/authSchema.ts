import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username must be at least 1 characters")
    .max(20, "Username must be 20 characters or less")
    .regex(
      /^[\p{L}\p{N}._-]+$/u,
      `Only letters, numbers, ".", "_" and "-" allowed`
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password Must contain uppercase letter")
    .regex(/[a-z]/, "Password Must contain lowercase letter")
    .regex(/[0-9]/, "Password Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password Must contain a symbol"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female", "Prefer Not to Say"]).optional(),
  bio: z.string().optional(),
});