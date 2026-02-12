import {
  decreaseGuestQty,
  increaseGuestQty,
  removeGuestItem,
} from "./guestCart.helper";
import {
  decreaseUserQty,
  increaseUserQty,
  removeUserItem,
} from "./userCart.helper";

export async function updateCartQty({
  userId,
  productId,
  type,
}: {
  userId?: string;
  productId: string;
  type: "inc" | "dec" | "remove";
}) {
  if (userId) {
    if (type === "inc") return increaseUserQty(userId, productId);
    if (type === "dec") return decreaseUserQty(userId, productId);
    if (type === "remove") return removeUserItem(userId, productId);
  } else {
    if (type === "inc") return increaseGuestQty(productId);
    if (type === "dec") return decreaseGuestQty(productId);
    if (type === "remove") return removeGuestItem(productId);
  }
}
