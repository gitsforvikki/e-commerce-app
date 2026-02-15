import { getLoggedInUser } from "@/lib/auth";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";
import { CartItemUiType } from "@/type";
import { routes } from "@/utils/routes";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import React from "react";

export const OrderSummery = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userInfo = await getLoggedInUser();
  const items: CartItemUiType[] = await getCartItemsFromDB(userInfo?.userId);
  const grandTotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const totalTax = () => {
    return Math.round(grandTotal / 10);
  };
  const shippingAmmount = grandTotal < 1000 ? 50 : 0;
  const payableAmount =
    shippingAmmount > 0
      ? grandTotal + totalTax() + shippingAmmount
      : grandTotal + totalTax();

  return (
    <>
      {items && items?.length > 0 ? (
        <div className="lg:col-span-1">
          <div className="border border-slate-300 shadow-2xl rounded-lg p-6 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-foreground/80">
                <span>Subtotal</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground/80">
                <span>Tax (10%)</span>
                <span>₹{totalTax().toFixed(2)}</span>
              </div>
              {shippingAmmount > 0 && (
                <div className="flex justify-between text-foreground/80">
                  <span>Shipping</span>
                  <span>₹{shippingAmmount.toFixed(2)}</span>
                </div>
              )}
              {shippingAmmount === 0 && grandTotal > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-violet-600 hover:via-violet-700 font-semibold">
                  ₹{payableAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div>{items.length > 0 ? children : null}</div>

            {grandTotal > 0 && grandTotal < 1000 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  🎉 Free shipping on orders over <strong>1000</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mb-6">
            <Package className="w-24 h-24 mx-auto text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Empty cart yet
          </h2>
          <p className="text-muted-foreground mb-6">
            You haven't added any Item in your cart yet. Start shopping to
            create your first order!
          </p>
          <Link
            href={routes.HOME}
            className="text-white inline-block px-6 py-3 bg-violet-500 rounded-lg font-medium hover:bg-violet-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </>
  );
};
