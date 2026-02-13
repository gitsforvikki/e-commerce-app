import { getLoggedInUser } from "@/lib/auth";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";

export async function GET() {
  const userInfo = await getLoggedInUser();
  const items = await getCartItemsFromDB(userInfo?.userId);

  return Response.json({ items });
}
