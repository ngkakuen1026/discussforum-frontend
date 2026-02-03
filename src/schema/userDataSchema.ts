import { z } from "zod";

export const usernameSchema = z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters.")
    .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username can only contain letters, numbers, dots, underscores, and hyphens"
    )
    .trim();

export const emailSchema = z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .trim()
    .toLowerCase();

export const nameSchema = z
    .string()
    .max(50, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .trim()
    .optional();

export const phoneSchema = z
    .string()
    .min(8, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number (e.g., +85212345678 or 12345678)"
    )
    .trim()
    .optional();

export const editProfileSchema = z.object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    first_name: nameSchema,
    last_name: nameSchema,
    phone: phoneSchema,
});

export const editProfileSchemaStrict = editProfileSchema.refine(
    (data) => {
        return Object.values(data).some((value) => value !== undefined && value !== "");
    },
    {
        message: "At least one field must be provided",
    }
);