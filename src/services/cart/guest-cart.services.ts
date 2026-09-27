import { cookies } from "next/headers";
import { z } from "zod";

const CART_KEY = "cart";
const guestCartSchema = z
  .array(
    z.object({
      productId: z.string().regex(/^[a-f\d]{24}$/i),
      qty: z.number().int().min(1).max(99),
    }),
  )
  .max(30);

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
    const parsed = guestCartSchema.safeParse(JSON.parse(cart.value));
    if (parsed.success) return parsed.data;
    return [];
  } catch {
    return [];
  }
};
//save guest cart

export const saveToGuestCart = async (cartItems: guestCartType[]) => {
  const parsed = guestCartSchema.safeParse(cartItems);
  if (!parsed.success) throw new Error("Guest cart data is invalid");
  const store = await cookies();
  store.set(CART_KEY, JSON.stringify(parsed.data), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
};

//add to guest cart
export const addToGuestCart = async (productId: string, quantity = 1) => {
  if (!/^[a-f\d]{24}$/i.test(productId)) throw new Error("Invalid product ID");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error("Invalid quantity");
  }
  const cartItems = await getGuestCart();
  const existingItem = cartItems.find(
    (item: guestCartType) => item.productId.toString() === productId.toString(),
  );
  if (existingItem) {
    if (existingItem.qty + quantity > 99)
      throw new Error("Maximum quantity reached");
    existingItem.qty += quantity;
  } else {
    if (cartItems.length >= 30) throw new Error("Guest cart is full");
    cartItems.push({ productId, qty: quantity });
  }
  await saveToGuestCart(cartItems);
};

export async function clearGuestCart() {
  const store = await cookies();
  store.delete(CART_KEY);
}
