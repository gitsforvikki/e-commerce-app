"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CartList } from "@/components/cart/CartList";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { EmptyCart } from "@/ui/cart-ui/EmptyCart";
import { routes } from "@/utils/routes";
import { ShoppingBag, ChevronRight, Home, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const CartPageClient = () => {
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skeleton view during initial hydration
  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-16rem)] bg-slate-50/60 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-9 w-60 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalItemsCount = items.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-slate-50/60 dark:bg-slate-950 py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Link
            href={routes.HOME}
            className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Shopping Cart
          </span>
        </nav>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm">
            <EmptyCart />
          </div>
        ) : (
          <>
            {/* Header with Title and Item Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Shopping Cart
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Review your items, update quantities, or proceed to checkout
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/60 shadow-2xs">
                  {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"} in Bag
                </span>
              </div>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Items List (8 cols) */}
              <div className="lg:col-span-8">
                <CartList />
              </div>

              {/* Right Column: Order Summary Sticky Sidebar (4 cols) */}
              <div className="lg:col-span-4">
                <CartOrderSummary />
              </div>
            </div>

            {/* Bottom Guarantees Strip */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Free Express Shipping</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">On all orders above ₹1,000</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">30-Day Easy Returns</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Quick doorstep pickups & refunds</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Bank-Grade Security</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">256-bit encrypted checkout</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
