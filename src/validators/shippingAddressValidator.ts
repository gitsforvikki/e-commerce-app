import { z } from "zod";

export const shippingAddressValidator = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  home: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(50),
  state: z.string().trim().min(2).max(50),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian pincode"),
});

export type ShippingAddressType = z.infer<typeof shippingAddressValidator>;
