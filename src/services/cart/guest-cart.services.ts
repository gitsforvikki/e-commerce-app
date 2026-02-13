import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CART_KEY = "cart";

interface guestCartType {
  productId: string;
  qty: number;
}
//get guest cart

export const getGuestCart = async (): Promise<guestCartType[]> => {
  const store = await cookies();
  const cart = store.get(CART_KEY);
  if (!cart) return [];
  try {
    return JSON.parse(cart.value);
  } catch (err) {
    return [];
  }
};
//save guest cart

export const saveToGuestCart = async (cartItems: guestCartType[]) => {
  const store = await cookies();
  store.set(CART_KEY, JSON.stringify(cartItems), {
    httpOnly: true,
    path: "/",
  });
};

//add to guest cart
export const addToGuestCart = async (productId: string) => {
  const cartItems = await getGuestCart();
  const existingItem = cartItems.find(
    (item: guestCartType) => item.productId.toString() === productId.toString(),
  );
  if (existingItem) {
    redirect("/login");
  } else {
    cartItems.push({ productId, qty: 1 });
  }
  await saveToGuestCart(cartItems);
};

export async function clearGuestCart() {
  const store = await cookies();
  store.delete(CART_KEY);
}
