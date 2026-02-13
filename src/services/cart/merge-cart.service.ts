import { Types } from "mongoose";
import { getGuestCart, clearGuestCart } from "./guest-cart.services";
import { getOrCreateCart } from "./user-cart.service";

export async function mergeGuestCart(userId: string) {
  const guestItems = await getGuestCart();
  if (!guestItems.length) return;

  const dbCart = await getOrCreateCart(userId);

  for (const item of guestItems) {
    const existing = dbCart.items.find(
      (i) => i.productId.toString() === item.productId,
    );

    if (existing) {
      existing.qty = existing.qty;
    } else {
      dbCart.items.push({
        productId: new Types.ObjectId(item.productId),
        qty: item.qty,
      });
    }
  }
  await clearGuestCart();
  await dbCart.save();
}
