import {
  addToGuestCart,
  getGuestCart,
  saveToGuestCart,
} from "./guest-cart.services";
import { addToUserCart } from "./user-cart.service";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Types } from "mongoose";

export async function addToCart({
  userId,
  productId,
  quantity = 1,
}: {
  userId?: string;
  productId: string;
  quantity?: number;
}) {
  if (!Types.ObjectId.isValid(productId)) throw new Error("Invalid product ID");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error("Invalid quantity");
  }
  await connectDB();
  const product = await Product.findById(productId).select("qty");
  if (!product || product.qty < 1) throw new Error("Product is unavailable");

  if (!userId) {
    const items = await getGuestCart();
    const existing = items.find((item) => item.productId === productId);
    if (existing) {
      if (
        existing.qty + quantity > product.qty ||
        existing.qty + quantity > 99
      ) {
        throw new Error("No additional stock is available");
      }
      existing.qty += quantity;
      await saveToGuestCart(items);
      return;
    }
    if (quantity > product.qty)
      throw new Error("No additional stock is available");
    await addToGuestCart(productId, quantity);
    return;
  }

  return addToUserCart({ userId, productId, quantity });
}
