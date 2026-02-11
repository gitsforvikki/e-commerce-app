import { addToGuestCart } from "./guest-cart.services";
import { addToUserCart } from "./user-cart.service";

export async function addToCart({
  userId,
  productId,
}: {
  userId?: string;
  productId: string;
}) {
  if (!userId) {
    return addToGuestCart(productId);
  }

  return addToUserCart({ userId, productId });
}
