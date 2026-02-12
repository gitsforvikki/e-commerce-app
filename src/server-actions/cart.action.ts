"use server";

import { getLoggedInUser } from "@/lib/auth";
import { addToCart } from "@/services/cart/cart.service";
import { updateCartQty } from "@/utils/cart/updateCart.helper";
import { revalidatePath } from "next/cache";

export async function addToCartAction(productId: string) {
  const userInfo = await getLoggedInUser();

  await addToCart({
    userId: userInfo?.userId,
    productId,
  });
}

export async function updateCartAction(productId: string, type: string) {
  const user = await getLoggedInUser();

  await updateCartQty({
    userId: user?.userId,
    productId,
    type: type as any,
  });
  revalidatePath("/cart");
}
