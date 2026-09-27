"use client";

import Link from "next/link";
import { CartItemCard } from "@/ui/cart-ui/CartItemCard";
import { useCartStore } from "@/store/cartStore";
import { routes } from "@/utils/routes";
import {
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Sparkles,
} from "lucide-react";
import { formatInr } from "@/services/order/pricing.service";
import { updateCartAction } from "@/server-actions/cart.action";

const FREE_SHIPPING_THRESHOLD_PAISE = 100_000; // ₹1,000

export const CartList = () => {
  const { items, setCart } = useCartStore();

  const subtotalPaise = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.qty,
    0,
  );

  const amountNeededPaise = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);
  const freeShippingUnlocked = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE;
  const progressPercent = Math.min(100, Math.round((subtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100));

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear all items from your cart?")) return;
    const itemsToRemove = [...items];
    setCart([]);
    for (const item of itemsToRemove) {
      try {
        await updateCartAction(item._id, "remove");
      } catch (e) {
        console.error("Failed to remove item", e);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Free Shipping Progress Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${freeShippingUnlocked ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400"}`}>
              <Truck size={16} />
            </div>
            {freeShippingUnlocked ? (
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                🎉 Congratulations! You have unlocked FREE Express Delivery.
              </span>
            ) : (
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Add <strong className="text-violet-600 dark:text-violet-400">{formatInr(amountNeededPaise)}</strong> more to unlock <strong className="text-slate-900 dark:text-white">FREE Shipping</strong>!
              </span>
            )}
          </div>
          <span className="font-bold text-xs text-slate-500 dark:text-slate-400">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              freeShippingUnlocked
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-violet-600 to-indigo-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Items List Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80">
        {/* Table/List Header */}
        <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          <span>Items ({items.reduce((acc, curr) => acc + curr.qty, 0)})</span>
          <button
            type="button"
            onClick={handleClearCart}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors font-medium cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Item Rows */}
        {items.map((item) => (
          <CartItemCard key={item._id} {...item} />
        ))}
      </div>

      {/* Action Footer & Trust Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          href={routes.PRODUCTS}
          className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Continue Shopping</span>
        </Link>

        {/* Guarantees */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <RotateCcw size={14} className="text-blue-500" />
            <span>30-Day Returns</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>100% Secure Checkout</span>
          </span>
        </div>
      </div>
    </div>
  );
};
