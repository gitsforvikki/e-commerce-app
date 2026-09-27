import { z } from "zod";
const CategoryEnum = z.enum(["KIDS", "MEN", "WOMEN"]);

export const productSchemaValidator = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters long")
    .max(80, "Product name must be at most 80 characters long"),
  price: z.number().min(0, "Price must be a positive number"),
  description: z
    .string()
    .min(1, "Product description is required")
    .max(500, "Description must be at most 500 characters long"),
  image: z.string().url("Invalid image URL"),
  qty: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
    .max(1_000_000, "Quantity is too large"),
  brand: z
    .string()
    .min(2, "Brand name must be at least 2 characters long")
    .max(50, "Brand name must be at most 50 characters long"),

  category: CategoryEnum.refine(Boolean, {
    message: "Category must be one of: KIDS, MEN, WOMEN",
  }),
  usage: z
    .string()
    .min(1, "Product usage information is required")
    .max(300, "Usage information must be at most 300 characters long"),
});
