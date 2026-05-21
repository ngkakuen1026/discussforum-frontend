import { z } from "zod";
import {
  usernameSchema,
  nameSchema,
  emailSchema,
  phoneSchema
} from "../schema/userDataSchema";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Generic validation functions
export const validateField = <T>(
  value: string,
  schema: z.ZodSchema<T>,
  fieldName: string = "Field"
): ValidationResult => {
  const trimmed = value.trim();
  try {
    schema.parse(trimmed);
    return { isValid: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstError = err.issues?.[0]?.message ?? `Invalid ${fieldName}`;
      return { isValid: false, error: firstError }
    }

    return { isValid: false, error: `Invalid ${fieldName}` };
  }
}

export const validateUsername = (value: string): ValidationResult => (
  validateField(value, usernameSchema, "Username")
)

export const validateEmail = (value: string): ValidationResult =>
  validateField(value, emailSchema, "Email");

export const validateFirstName = (value: string): ValidationResult =>
  validateField(value, nameSchema, "First Name");

export const validateLastName = (value: string): ValidationResult =>
  validateField(value, nameSchema, "Last Name");

export const validatePhone = (value: string): ValidationResult =>
  validateField(value, phoneSchema, "Phone");