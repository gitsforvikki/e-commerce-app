import { Product } from "@/models/Product";
import { getGuestCart } from "./guest-cart.services";
import { getOrCreateCart } from "./user-cart.service";

export async function getCartItems(userId?: string) {
  let items: { productId: string; qty: number }[] = [];

  if (userId) {
    const cart = await getOrCreateCart(userId);

    items = cart.items.map((i) => ({
      productId: i.productId.toString(),
      qty: i.qty,
    }));
  } else {
    items = await getGuestCart();
  }

  if (!items.length) return [];

  const ids = items.map((i) => i.productId);

  const products = await Product.find({
    _id: { $in: ids },
  }).lean();

  return items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId);

    return {
      ...product,
      qty: item.qty,
      total: product.price * item.qty,
    };
  });
}
