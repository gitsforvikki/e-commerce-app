"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { routes } from "@/utils/routes";
import {
  calculateOrderPricing,
  formatInr,
} from "@/services/order/pricing.service";
import {
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
  Lock,
  CreditCard,
  Truck,
} from "lucide-react";

export const CartOrderSummary = () => {
  const { items } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const pricing = calculateOrderPricing(items);

  // 10% discount if SHOP10 is applied
  const discountAmount = appliedCoupon === "SHOP10"
    ? Math.round(pricing.subtotalAmount * 0.1)
    : 0;

  const finalTotalAmount = Math.max(0, pricing.totalAmount - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;

    if (trimmed === "SHOP10") {
      setAppliedCoupon("SHOP10");
      setCouponCode("");
    } else {
      setCouponError("Invalid promo code. Try 'SHOP10' for 10% off.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg sticky top-24 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Order Summary
        </h2>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {items.reduce((acc, curr) => acc + curr.qty, 0)} items
        </span>
      </div>

      {/* Pricing Lines */}
      <div className="space-y-3.5 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatInr(pricing.subtotalAmount)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated GST (10%)</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatInr(pricing.taxAmount)}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
          <span>Shipping Fee</span>
          {pricing.shippingAmount === 0 ? (
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md text-xs border border-emerald-200/60 dark:border-emerald-900/40">
              FREE
            </span>
          ) : (
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatInr(pricing.shippingAmount)}
            </span>
          )}
        </div>

        {/* Applied Coupon Discount Row */}
        {appliedCoupon && (
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 text-xs">
            <span className="flex items-center gap-1 font-semibold">
              <Tag size={13} />
              <span>Coupon ({appliedCoupon}): 10% Off</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold">-{formatInr(discountAmount)}</span>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                title="Remove promo code"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Promo Code Input */}
      {!appliedCoupon && (
        <form onSubmit={handleApplyCoupon} className="pt-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag size={14} />
              </div>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Promo code (e.g. SHOP10)"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 uppercase font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1.5">
              {couponError}
            </p>
          )}
        </form>
      )}

      {/* Total Separator */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              Estimated Total
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              Including all applicable taxes
            </span>
          </div>
          <span className="text-2xl font-black text-violet-600 dark:text-violet-400 tracking-tight">
            {formatInr(finalTotalAmount)}
          </span>
        </div>
      </div>

      {/* Checkout Primary Button */}
      <Link
        href={routes.CHECKOUT}
        className="w-full py-4 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-99 text-white font-extrabold text-sm shadow-xl shadow-violet-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-101"
      >
        <Lock size={16} />
        <span>Proceed to Checkout</span>
        <ArrowRight size={17} />
      </Link>

      {/* Security & Payment Badges */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 justify-center font-medium">
          <ShieldCheck size={15} className="text-emerald-500" />
          <span>256-Bit SSL Bank-Grade Encryption</span>
        </div>

        {/* Payment logos / badges */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
            UPI
          </span>
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
            RuPay
          </span>
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
            Visa
          </span>
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
            Mastercard
          </span>
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
            EMI
          </span>
        </div>
      </div>
    </div>
  );
};
