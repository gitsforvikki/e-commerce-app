import { Product } from "@/models/Product";
import { getGuestCart } from "./guest-cart.services";
import { getOrCreateCart } from "./user-cart.service";

export const totalTax = (total: number) => {
  return total / 10;
};

export async function getCartItemsFromDB(userId?: string) {
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
      _id: product._id.toString(),
      name: product.name,
      image: product.image,
      price: product.price,
      qty: item.qty,
      total: product.price * item.qty,
    };
  });
}
