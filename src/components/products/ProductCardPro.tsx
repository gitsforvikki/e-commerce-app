"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ProductType } from "@/type";
import { Heart, ShoppingCart, Check, Star, Eye } from "lucide-react";
import { addToCartAction } from "@/server-actions/cart.action";
import { useCartStore } from "@/store/cartStore";
import { formatInr } from "@/services/order/pricing.service";

interface ProductCardProProps {
  product: ProductType;
  viewMode?: "grid" | "list";
  onAddToCartSuccess?: (productName: string) => void;
}

export const ProductCardPro = ({
  product,
  viewMode = "grid",
  onAddToCartSuccess,
}: ProductCardProProps) => {
  const { _id, name, image, price, brand, category, qty, description } = product;
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { addItem } = useCartStore();

  const isAvailable = Number.isInteger(qty) && qty > 0;
  const isLowStock = isAvailable && qty <= 15;
  const productUrl = `/${category ? category.toLowerCase() : "products"}/${_id}`;

  // Deterministic aesthetic rating from id hash
  const ratingValue = 4.2 + ((name.charCodeAt(0) + name.length) % 8) / 10;
  const reviewCount = 28 + ((_id.charCodeAt(_id.length - 1) * 7) % 180);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAvailable || isPending) return;

    startTransition(async () => {
      // Immediate optimistic client store update
      addItem({
        _id,
        name,
        image,
        price,
        qty: 1,
        total: price,
      });

      setJustAdded(true);
      if (onAddToCartSuccess) {
        onAddToCartSuccess(name);
      }

      setTimeout(() => {
        setJustAdded(false);
      }, 2000);

      // Persist to backend / cookies
      try {
        await addToCartAction(_id, 1);
      } catch (err) {
        console.error("Failed to persist cart item:", err);
      }
    });
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  // ==========================================
  // LIST VIEW LAYOUT
  // ==========================================
  if (viewMode === "list") {
    return (
      <div className="group relative bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-violet-300 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-stretch">
        {/* Image Column */}
        <div className="relative w-full sm:w-56 md:w-64 aspect-4/3 sm:aspect-square shrink-0 rounded-xl overflow-hidden bg-slate-100">
          <Link href={productUrl} className="block w-full h-full">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              {brand}
            </span>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={handleFavoriteToggle}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-600 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
          >
            <Heart
              size={17}
              className={isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-600"}
            />
          </button>
        </div>

        {/* Info Column */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                {category}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>{ratingValue.toFixed(1)}</span>
                <span className="text-slate-400">({reviewCount})</span>
              </div>
            </div>

            <Link href={productUrl} className="group/link block">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover/link:text-violet-600 transition-colors line-clamp-1">
                {name}
              </h3>
            </Link>

            <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bottom Bar: Stock, Price and CTA */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatInr(Math.round(price * 100))}
              </div>
              <div className="text-xs font-medium mt-0.5">
                {!isAvailable ? (
                  <span className="text-rose-600 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-600 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Only {qty} left
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock ({qty})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={productUrl}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <Eye size={16} />
                <span>Details</span>
              </Link>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable || isPending}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                  justAdded
                    ? "bg-emerald-600 text-white"
                    : isAvailable
                    ? "bg-violet-600 hover:bg-violet-700 active:scale-98 text-white shadow-violet-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check size={16} className="stroke-[3]" />
                    <span>Added!</span>
                  </>
                ) : isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // GRID VIEW LAYOUT (DEFAULT)
  // ==========================================
  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-violet-300 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
        <Link href={productUrl} className="block w-full h-full">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
            {brand}
          </span>
          {isLowStock && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Low Stock
            </span>
          )}
          {!isAvailable && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleFavoriteToggle}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-600 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all"
        >
          <Heart
            size={16}
            className={isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-600"}
          />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:block">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable || isPending}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
              justAdded
                ? "bg-emerald-600 text-white"
                : isAvailable
                ? "bg-slate-900/90 hover:bg-violet-600 backdrop-blur-md text-white hover:shadow-violet-500/25"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={15} className="stroke-[3]" />
                <span>Added to Cart!</span>
              </>
            ) : isPending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-violet-600 uppercase tracking-wider text-[11px]">
              {category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium text-[11px]">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{ratingValue.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={productUrl} className="group/link block">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover/link:text-violet-600 transition-colors">
              {name}
            </h3>
          </Link>
        </div>

        {/* Footer: Price & Mobile CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block">
              {formatInr(Math.round(price * 100))}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">
              Free delivery
            </span>
          </div>

          {/* Mobile CTA (always visible on touch / mobile) */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable || isPending}
              aria-label="Add to cart"
              className={`p-2.5 rounded-xl transition-all ${
                justAdded
                  ? "bg-emerald-600 text-white"
                  : isAvailable
                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {justAdded ? (
                <Check size={16} className="stroke-[3]" />
              ) : isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ShoppingCart size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
