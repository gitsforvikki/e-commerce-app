import { getOrCreateCart } from "@/services/cart/user-cart.service";

//increase cart items
export async function increaseUserQty(userId: string, productId: string) {
  const cart = await getOrCreateCart(userId);

  const item = cart.items.find((i) => i.productId.toString() === productId);

  if (item) {
    item.qty += 1;
    await cart.save();
  }
}

//decrease cart items
export async function decreaseUserQty(userId: string, productId: string) {
  const cart = await getOrCreateCart(userId);

  const item = cart.items.find((i) => i.productId.toString() === productId);

  if (!item) return;

  item.qty = item.qty > 1 ? item.qty - 1 : item.qty;

  // if (item.qty <= 0) {
  //   cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
  // }

  await cart.save();
}
//remove cart item
export async function removeUserItem(userId: string, productId: string) {
  const cart = await getOrCreateCart(userId);

  cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

  await cart.save();
}
