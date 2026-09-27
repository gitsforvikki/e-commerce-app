import {
  getGuestCart,
  saveToGuestCart,
} from "@/services/cart/guest-cart.services";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export async function increaseGuestQty(productId: string) {
  const cart = await getGuestCart();

  const item = cart.find((i) => i.productId === productId);
  if (item) {
    await connectDB();
    const product = await Product.findById(productId).select("qty");
    if (!product || item.qty >= product.qty || item.qty >= 99) {
      throw new Error("No additional stock is available");
    }
    item.qty += 1;
    await saveToGuestCart(cart);
  }
}
export async function decreaseGuestQty(productId: string) {
  const cart = await getGuestCart();

  const item = cart.find((i) => i.productId === productId);
  if (!item) return;

  item.qty = item.qty > 1 ? item.qty - 1 : item.qty;

  // if (item.qty <= 0) {
  //   return removeGuestItem(productId);
  // }

  await saveToGuestCart(cart);
}

export async function removeGuestItem(productId: string) {
  const cart = await getGuestCart();

  const updated = cart.filter((i) => i.productId !== productId);

  await saveToGuestCart(updated);
}
