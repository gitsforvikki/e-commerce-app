"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Sparkles, Compass } from "lucide-react";
import { routes } from "@/utils/routes";

export const EmptyCart = () => {
  const trendingTags = [
    { label: "Sneakers", href: "/products?search=Nike" },
    { label: "Sunglasses", href: "/products?search=Rayban" },
    { label: "Watches", href: "/products?search=Fossil" },
    { label: "Men's Wear", href: "/products?category=men" },
    { label: "Women's Wear", href: "/products?category=women" },
  ];

  return (
    <div className="py-16 sm:py-24 text-center max-w-xl mx-auto px-4">
      {/* Icon with glow background */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-violet-500/20 dark:bg-violet-500/30 rounded-full blur-2xl transform scale-150 pointer-events-none" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200/80 dark:border-violet-800/60 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-xl">
          <ShoppingBag size={48} className="stroke-[1.5]" />
        </div>
      </div>

      {/* Text Info */}
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold border border-violet-200/60 dark:border-violet-800/40">
          <Sparkles size={13} />
          <span>Cart is currently empty</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Looks like you haven&apos;t added anything to your cart yet. Explore our hand-picked collections to find your new favorites.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Link
          href={routes.PRODUCTS}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/25 transition-all hover:scale-102 active:scale-98"
        >
          <ShoppingBag size={18} />
          <span>Start Shopping</span>
          <ArrowRight size={16} />
        </Link>

        <Link
          href="/#categories"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors shadow-2xs"
        >
          <Compass size={18} />
          <span>Browse Categories</span>
        </Link>
      </div>

      {/* Popular Trending Tags */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Popular Collections:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {trendingTags.map((tag) => (
            <Link
              key={tag.label}
              href={tag.href}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/60 dark:hover:text-violet-300 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
