import { connectDB } from "@/lib/db";
import { Cart, CartDocument } from "@/models/Cart-model";
import { Product } from "@/models/Product";
import { Types } from "mongoose";

export async function getOrCreateCart(userId: string): Promise<CartDocument> {
  await connectDB();
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");
  const cart = await Cart.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $setOnInsert: { userId: new Types.ObjectId(userId), items: [] } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return cart;
}

export async function addToUserCart({
  userId,
  productId,
  quantity = 1,
}: {
  userId: string;
  productId: string;
  quantity?: number;
}) {
  if (!Types.ObjectId.isValid(productId)) throw new Error("Invalid product ID");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error("Invalid quantity");
  }
  const cart = await getOrCreateCart(userId);
  const product = await Product.findById(productId).select("qty");
  if (!product || product.qty < 1) throw new Error("Product is unavailable");

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId,
  );
  if (existingItem) {
    if (
      existingItem.qty + quantity > product.qty ||
      existingItem.qty + quantity > 99
    ) {
      throw new Error("No additional stock is available");
    }
    existingItem.qty += quantity;
  } else {
    if (quantity > product.qty)
      throw new Error("No additional stock is available");
    cart.items.push({
      productId: new Types.ObjectId(productId),
      qty: quantity,
    });
  }
  await cart.save();
}
