import { z } from "zod";

export const profileFormValidator = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .trim(),

  email: z.string().email("Invalid email address").trim(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),

  home: z.string().max(200, "Address is too long").trim().optional(),

  city: z
    .string()
    .min(2, "City name too short")
    .max(50, "City name too long")
    .regex(/^[a-zA-Z\s]+$/, "City should contain only letters")
    .trim(),

  state: z
    .string()
    .min(2, "State name too short")
    .max(50, "State name too long")
    .regex(/^[a-zA-Z\s]+$/, "State should contain only letters")
    .trim(),

  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian pincode"),
});
