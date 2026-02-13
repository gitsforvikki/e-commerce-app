import { OrderSummery } from "@/components/order/OrderSummery";
import { getLoggedInUser } from "@/lib/auth";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";
import { CartItemUiType } from "@/type";
import { CartItemCard } from "@/ui/cart-ui/CartItemCard";
import { EmptyCart } from "@/ui/cart-ui/EmptyCart";
import Link from "next/link";

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
              {/* Cart Items */}

              <div className="lg:col-span-2 space-y-4">
                <div className="bg-card border border-slate-200 shadow-2xl rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-indigo-100 font-semibold border-b border-slate-300">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Action</div>
                  </div>

                  {items.map((item, index) => (
                    <CartItemCard key={index} {...item} />
                  ))}
                </div>

                <Link
                  href="/"
                  className="text-lg inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
                >
                  <span>← Continue Shopping</span>
                </Link>
              </div>

              {/* Order Summary */}
              <OrderSummery />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
