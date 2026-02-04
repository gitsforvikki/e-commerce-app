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
    .max(500, "Description must be at most 500 characters long")
    .optional(),
  image: z.string().url("Invalid image URL"),
  qty: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
  brand: z
    .string()
    .min(2, "Brand name must be at least 2 characters long")
    .max(50, "Brand name must be at most 50 characters long"),

  category: CategoryEnum.refine(Boolean, {
    message: "Category must be one of: KIDS, MEN, WOMEN",
  }),
  stock: z.number().min(0, "Stock cannot be negative"),
  usage: z
    .string()
    .max(300, "Usage information must be at most 300 characters long")
    .optional(),
});
