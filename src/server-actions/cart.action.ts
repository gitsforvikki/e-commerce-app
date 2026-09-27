"use server";

import { getLoggedInUser } from "@/lib/auth";
import { addToCart } from "@/services/cart/cart.service";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";
import { saveToGuestCart } from "@/services/cart/guest-cart.services";
import { updateCartQty } from "@/utils/cart/updateCart.helper";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { requireUser } from "@/lib/access-control";

function validateProductId(productId: string) {
  if (typeof productId !== "string" || !Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }
}

export async function addToCartAction(productId: string, quantity = 1) {
  validateProductId(productId);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error("Invalid quantity");
  }
  const session = await getLoggedInUser();
  const userInfo = session ? await requireUser() : null;

  await addToCart({
    userId: userInfo?._id.toString(),
    productId,
    quantity,
  });
}

export async function updateCartAction(
  productId: string,
  type: "inc" | "dec" | "remove",
) {
  validateProductId(productId);
  if (type !== "inc" && type !== "dec" && type !== "remove") {
    throw new Error("Invalid cart operation");
  }
  const session = await getLoggedInUser();
  const user = session ? await requireUser() : null;

  await updateCartQty({
    userId: user?._id.toString(),
    productId,
    type,
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
  } catch (error) {
    console.error("Unable to preserve cart during logout", error);
    throw error;
  }
};
