"use server";

import { getLoggedInUser } from "@/lib/auth";
import { addToCart } from "@/services/cart/cart.service";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";
import { saveToGuestCart } from "@/services/cart/guest-cart.services";
import { updateCartQty } from "@/utils/cart/updateCart.helper";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

//while logged-out the user take db cart and set to the cookies
export const logoutAndUpdateCookiesCart = async () => {
  try {
    const userInfo = await getLoggedInUser();
    if (userInfo?.userId) {
      const dbCart = await getCartItemsFromDB(userInfo.userId);
      const cartItemForCookies = dbCart.map((i) => {
        return {
          productId: i._id.toString(),
          qty: Number(i.qty),
        };
      });
      await saveToGuestCart(cartItemForCookies);
    }

    //remove token and logged out user
    (await cookies()).delete("token");
    
  } catch (err) {
    console.error(err);
  }
};
