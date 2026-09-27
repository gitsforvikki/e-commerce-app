import { Types } from "mongoose";
import { getGuestCart, clearGuestCart } from "./guest-cart.services";
import { getOrCreateCart } from "./user-cart.service";
import { Product } from "@/models/Product";

export async function mergeGuestCart(userId: string) {
  const guestItems = await getGuestCart();
  if (!guestItems.length) return;

  const dbCart = await getOrCreateCart(userId);
  const productIds = guestItems.map(
    (item) => new Types.ObjectId(item.productId),
  );
  const products = await Product.find({ _id: { $in: productIds } }).select(
    "_id qty",
  );

  for (const item of guestItems) {
    const product = products.find((p) => p._id.toString() === item.productId);
    if (!product || product.qty < 1) continue;
    const existing = dbCart.items.find(
      (i) => i.productId.toString() === item.productId,
    );

    if (existing) {
      existing.qty = Math.min(existing.qty + item.qty, product.qty, 99);
    } else {
      dbCart.items.push({
        productId: new Types.ObjectId(item.productId),
        qty: Math.min(item.qty, product.qty, 99),
      });
    }
  }
  await dbCart.save();
  await clearGuestCart();
}
