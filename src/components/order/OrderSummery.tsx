import { getLoggedInUser } from "@/lib/auth";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";
import { CartItemUiType } from "@/type";
import { routes } from "@/utils/routes";
import { Package, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  calculateOrderPricing,
  formatInr,
} from "@/services/order/pricing.service";

export const OrderSummery = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userInfo = await getLoggedInUser();
  const items: CartItemUiType[] = await getCartItemsFromDB(userInfo?.userId);
  const pricing = calculateOrderPricing(items);

  return (
    <>
      {items && items.length > 0 ? (
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Order Summary
              </h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {items.reduce((acc, curr) => acc + curr.qty, 0)} items
              </span>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatInr(pricing.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (10%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatInr(pricing.taxAmount)}
                </span>
              </div>
              {pricing.shippingAmount > 0 ? (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatInr(pricing.shippingAmount)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md text-xs border border-emerald-200/60 dark:border-emerald-900/40">
                    FREE
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  Total
                </span>
                <span className="text-2xl font-black text-violet-600 dark:text-violet-400 tracking-tight">
                  {formatInr(pricing.totalAmount)}
                </span>
              </div>
            </div>

            <div>{children}</div>

            {pricing.subtotalAmount > 0 && pricing.subtotalAmount < 100_000 && (
              <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800/50 rounded-2xl p-3.5">
                <p className="text-xs text-violet-800 dark:text-violet-300 font-medium">
                  🎉 Free shipping on all orders over <strong>₹1,000</strong>
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Safe & Secure Bank-Grade Checkout</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
            <Package size={36} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You haven&apos;t added any items yet. Start shopping to proceed to checkout!
          </p>
          <Link
            href={routes.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </>
  );
};
