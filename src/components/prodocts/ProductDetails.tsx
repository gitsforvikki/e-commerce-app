"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ProductType } from "@/type";
import { addToCartAction } from "@/server-actions/cart.action";
import { useCartStore } from "@/store/cartStore";
import { formatInr } from "@/services/order/pricing.service";
import { routes } from "@/utils/routes";
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  ChevronDown,
  ChevronRight,
  Star,
  Check,
  Package,
} from "lucide-react";

export default function ProductDetails({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "description",
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addItem } = useCartStore();

  const available = Number.isInteger(product.qty) && product.qty > 0;
  const isLowStock = available && product.qty <= 15;

  // Consistent rating aesthetic
  const ratingValue =
    4.3 + ((product.name.charCodeAt(0) + product.name.length) % 7) / 10;
  const reviewCount =
    32 + ((product._id.charCodeAt(product._id.length - 1) * 9) % 180);

  const handleAddToCart = () => {
    setError(null);
    if (!available || isPending) return;

    startTransition(async () => {
      try {
        addItem({
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: quantity,
          total: product.price * quantity,
        });

        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2500);

        await addToCartAction(product._id, quantity);
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to add this item to your cart",
        );
      }
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection((current) => (current === section ? null : section));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8"
        >
          <Link
            href={routes.HOME}
            className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
          <Link
            href={routes.PRODUCTS}
            className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Products
          </Link>
          <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
          <Link
            href={`/products?category=${product.category?.toLowerCase()}`}
            className="capitalize hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {product.category?.toLowerCase()}
          </Link>
          <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 items-start">
          {/* LEFT: Product Image with badges */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Brand Floating Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider border border-slate-200/60 dark:border-slate-700">
                {product.brand}
              </span>
            </div>
          </div>

          {/* RIGHT: Product Info & Actions */}
          <div className="space-y-6">
            {/* Category, Brand & Title */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>

                {/* Star rating */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 px-2.5 py-0.5 rounded-md">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="text-slate-800 dark:text-slate-200">
                    {ratingValue.toFixed(1)}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Stock Status Badge */}
              <div className="flex items-center gap-2">
                {available ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {isLowStock
                      ? `Only ${product.qty} left in stock!`
                      : `In Stock (${product.qty} units available)`}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Currently Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatInr(Math.round(product.price * 100))}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                Free Delivery Included
              </span>
            </div>

            {/* Specs Overview Box */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Category
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {product.category}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Brand
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {product.brand}
                </p>
              </div>
            </div>

            {/* Quantity Selector & Wishlist */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="px-3.5 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-xl disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    −
                  </button>
                  <span className="min-w-10 px-2 py-2 text-center text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={
                      !available || quantity >= product.qty || quantity >= 99
                    }
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(product.qty, 99, value + 1),
                      )
                    }
                    className="px-3.5 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-r-xl disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsFavorite((value) => !value)}
                  aria-pressed={isFavorite}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs transition-colors"
                >
                  <Heart
                    size={18}
                    className={
                      isFavorite
                        ? "fill-rose-500 text-rose-500"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  />
                  <span>{isFavorite ? "Saved in Wishlist" : "Save for later"}</span>
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!available || isPending}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition-all shadow-md ${
                  justAdded
                    ? "bg-emerald-600 text-white"
                    : available
                    ? "bg-violet-600 hover:bg-violet-700 active:scale-98 text-white shadow-violet-500/25 dark:shadow-none"
                    : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check size={20} className="stroke-[3]" />
                    <span>Added to Cart!</span>
                  </>
                ) : isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>{available ? "Add to Cart" : "Out of Stock"}</span>
                  </>
                )}
              </button>

              {error && (
                <p role="alert" className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Free Delivery
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    On all orders above ₹499
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Secure Checkout
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    100% verified payments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Details & Usage Sections */}
        <div className="mt-14 max-w-4xl space-y-3">
          {/* Description Accordion */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors">
            <button
              type="button"
              onClick={() => toggleSection("description")}
              className="flex w-full items-center justify-between p-5 text-left text-slate-900 dark:text-white font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Product Description</span>
              <ChevronDown
                size={18}
                className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                  expandedSection === "description" ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "description" && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>{product.description || "No description provided for this product."}</p>
              </div>
            )}
          </section>

          {/* Usage Information Accordion */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors">
            <button
              type="button"
              onClick={() => toggleSection("usage")}
              className="flex w-full items-center justify-between p-5 text-left text-slate-900 dark:text-white font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Usage & Care Guide</span>
              <ChevronDown
                size={18}
                className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                  expandedSection === "usage" ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "usage" && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>{product.usage || "No usage instructions specified."}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
