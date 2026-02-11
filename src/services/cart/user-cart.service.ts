import { Cart, CartDocument } from "@/models/Cart-model";
import { Types } from "mongoose";

export async function getOrCreateCart(userId: string): Promise<CartDocument> {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId: new Types.ObjectId(userId),
      items: [],
    });
  }

  return cart;
}

export async function addToUserCart({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  try {
    const cart = await getOrCreateCart(userId);
    const existingItem = cart?.items.find(
      (item) => item.productId.toString() === productId.toString(),
    );
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart?.items.push({ productId: new Types.ObjectId(productId), qty: 1 });
    }
    await cart?.save();
  } catch (err) {
    console.error(err);
  }
}
