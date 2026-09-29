import { Types } from "mongoose";
import { getGuestCart, saveToGuestCart } from "./guest-cart.services";
import { getOrCreateCart } from "./user-cart.service";
import { Product } from "@/models/Product";
import { connectDB } from "@/lib/db";

export async function mergeGuestCart(userId: string | Types.ObjectId) {
  const userIdStr = userId.toString();
  if (!Types.ObjectId.isValid(userIdStr)) return;

  await connectDB();

  const guestItems = await getGuestCart();
  const dbCart = await getOrCreateCart(userIdStr);

  // If both carts are empty, nothing to merge
  if (!guestItems.length && !dbCart.items.length) {
    return;
  }

  // Map of guest cart items (productId -> qty)
  const guestMap = new Map<string, number>();
  for (const item of guestItems) {
    guestMap.set(item.productId, item.qty);
  }

  // Map of DB cart items (productId -> qty)
  const dbMap = new Map<string, number>();
  for (const item of dbCart.items) {
    dbMap.set(item.productId.toString(), item.qty);
  }

  // Union of all unique product IDs from both carts
  const allProductIds = Array.from(
    new Set([...guestMap.keys(), ...dbMap.keys()]),
  );

  const validObjectIds = allProductIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  const products = await Product.find({ _id: { $in: validObjectIds } }).select(
    "_id qty",
  );
  const productStockMap = new Map<string, number>();
  for (const product of products) {
    productStockMap.set(product._id.toString(), product.qty);
  }

  const mergedDbItems: { productId: Types.ObjectId; qty: number }[] = [];
  const mergedGuestItems: { productId: string; qty: number }[] = [];

  for (const productId of allProductIds) {
    const stock = productStockMap.get(productId);
    // Skip if product doesn't exist or is out of stock
    if (stock === undefined || stock < 1) continue;

    const guestQty = guestMap.get(productId);
    const dbQty = dbMap.get(productId);

    let targetQty: number;

    if (guestQty !== undefined && dbQty !== undefined) {
      // Condition 1: Same item in both guest cart and DB cart
      // -> update with max(guest cart qty, db cart qty)
      // -> if quantities are same, max returns that exact quantity
      targetQty = Math.max(guestQty, dbQty);
    } else if (guestQty !== undefined) {
      // Condition 2a: Item exists only in guest cart -> combine
      targetQty = guestQty;
    } else if (dbQty !== undefined) {
      // Condition 2b: Item exists only in DB cart -> combine
      targetQty = dbQty;
    } else {
      continue;
    }

    // Clamp by available inventory and max 99
    const finalQty = Math.min(targetQty, stock, 99);
    if (finalQty < 1) continue;

    mergedDbItems.push({
      productId: new Types.ObjectId(productId),
      qty: finalQty,
    });

    mergedGuestItems.push({
      productId,
      qty: finalQty,
    });
  }

  // Update DB cart with combined items
  dbCart.items = mergedDbItems as any;
  await dbCart.save();

  // Update Guest cart (cookies) with the same combined items (cookie schema max 30)
  await saveToGuestCart(mergedGuestItems.slice(0, 30));
}
