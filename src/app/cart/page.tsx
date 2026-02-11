import { getLoggedInUser } from "@/lib/auth";
import { getCartItems } from "@/services/cart/get-cart-items.service";

export default async function CartPage() {
  const userInfo = await getLoggedInUser();
  const items = await getCartItems(userInfo?.userId);
  console.log("items", items);
  return (
    <div>
      <h2>cart items</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id}>
            <h2>{item.name}</h2>
            <p>Qty: {item.qty}</p>
            <p>Total: ₹{item.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
