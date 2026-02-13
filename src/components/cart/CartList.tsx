"use client";

import { CartItemUiType } from "@/type";
import Link from "next/link";
import { CartItemCard } from "@/ui/cart-ui/CartItemCard";
import { useCartStore } from "@/store/cartStore";

export const CartList = () => {
  const { items } = useCartStore();
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="bg-card border border-slate-200 shadow-2xl rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-indigo-100 font-semibold border-b border-slate-300">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Product</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {items?.map((item, index) => (
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
  );
};
