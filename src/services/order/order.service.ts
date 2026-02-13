import { getCartItemsFromDB } from "../cart/get-cart-fromdb.service";
import { getCurrentUserData } from "../user/user.service";

const userInfo = await getCurrentUserData();

export async function createOrderService(
  userId: string,
  address: { home: string; city: string; state: string; pincode: string },
) {
  // 1. Get cart
  const cartInfo = await getCartItemsFromDB();

  // 2. Fetch products
  // 3. Validate stock
  // 4. Build order snapshot
  // 5. Calculate total
  // 6. Save order
  // 7. Return order
}
