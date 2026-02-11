"use server";

import { getLoggedInUser } from "@/lib/auth";
import { addToCart } from "@/services/cart/cart.service";


export async function addToCartAction(productId: string) {
  const userInfo = await getLoggedInUser();

  await addToCart({
    userId: userInfo?.userId,
    productId,
  });
}
