import { Metadata } from "next";
import Link from "next/link";
import { CartList } from "@/components/cart/CartList";
import { OrderSummery } from "@/components/order/OrderSummery";
import { getLoggedInUser } from "@/lib/auth";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";
import { CartItemUiType } from "@/type";
import { EmptyCart } from "@/ui/cart-ui/EmptyCart";
import { routes } from "@/utils/routes";

export const metadata: Metadata = {
  title: "Shopping Cart | ShopHub",
  description:
    "Manage your shopping cart at CodeBuddy. Easily update quantities, remove items, and continue to secure checkout for a smooth shopping experience.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CartPage() {
  const userInfo = await getLoggedInUser();
  const items: CartItemUiType[] = await getCartItemsFromDB(userInfo?.userId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">Shopping Cart</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">
          Shopping Cart
        </h1>
        <div>
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <CartList />
              <OrderSummery>
                <Link
                  href={routes.CHECKOUT}
                  className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                >
                  Process to checkout
                </Link>
              </OrderSummery>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
