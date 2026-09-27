import { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Cart | ShopHub",
  description:
    "Review your shopping cart, update item quantities, and proceed to secure checkout on ShopHub.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
