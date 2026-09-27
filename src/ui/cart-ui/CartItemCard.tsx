"use client";

import Image from "next/image";
import Link from "next/link";
import { updateCartAction } from "@/server-actions/cart.action";
import { useCartStore } from "@/store/cartStore";
import { CartItemUiType } from "@/type";
import { formatInr } from "@/services/order/pricing.service";
import { Trash2, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const CartItemCard = (item: CartItemUiType) => {
  const { _id, name, image, price, qty } = item;
  const { updateQty, removeItem } = useCartStore();
  const [updating, setUpdating] = useState(false);

  const handleIncrease = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      // Optimistic client update
      updateQty(_id, qty + 1);
      // Background server update
      await updateCartAction(_id, "inc");
    } catch (error) {
      console.error("Failed to increase cart qty:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (updating || qty <= 1) return;
    setUpdating(true);
    try {
      // Optimistic client update
      updateQty(_id, qty - 1);
      // Background server update
      await updateCartAction(_id, "dec");
    } catch (error) {
      console.error("Failed to decrease cart qty:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      // Optimistic client update
      removeItem(_id);
      // Background server update
      await updateCartAction(_id, "remove");
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdating(false);
    }
  };

  const lineTotalPaise = Math.round(price * 100) * qty;
  const unitPricePaise = Math.round(price * 100);

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
      {/* Product Image & Info */}
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {/* Thumbnail */}
        <Link
          href={`/product/${_id}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shrink-0 group block"
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </Link>

        {/* Details */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/40">
              <CheckCircle2 size={11} />
              <span>In Stock</span>
            </span>
          </div>

          <Link
            href={`/product/${_id}`}
            className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-2 leading-snug"
          >
            {name}
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Unit Price: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatInr(unitPricePaise)}</span>
          </p>
        </div>
      </div>

      {/* Stepper, Total & Remove Action */}
      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-xl p-1 shadow-2xs">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={qty <= 1 || updating}
            aria-label="Decrease quantity"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
          >
            <Minus size={14} />
          </button>

          <span className="w-9 text-center text-sm font-bold text-slate-900 dark:text-white select-none">
            {qty}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={updating}
            aria-label="Increase quantity"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right min-w-24">
          <span className="block text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {formatInr(lineTotalPaise)}
          </span>
          {qty > 1 && (
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-normal">
              {qty} × {formatInr(unitPricePaise)}
            </span>
          )}
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={updating}
          title="Remove from cart"
          aria-label={`Remove ${name} from cart`}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
