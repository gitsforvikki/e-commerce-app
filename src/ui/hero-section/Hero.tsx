"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/utils/routes";
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";

export const HeroPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(routes.PRODUCTS);
    }
  };

  const trendingTags = [
    { label: "Sneakers", query: "Nike" },
    { label: "Sunglasses", query: "Rayban" },
    { label: "Handbags", query: "Handbag" },
    { label: "Watches", query: "Fossil" },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-12 sm:py-20 lg:py-24">
      {/* Ambient background glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-slate-900/90 to-slate-950 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT: Headline, Search & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={14} className="text-violet-400" />
              <span>New Season Collection 2026 is Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Discover Quality Products{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">
                Crafted for You.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Explore authentic premium apparel, designer accessories, and everyday essentials with instant search, verified deals, and fast shipping.
            </p>

            {/* Working Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-lg mx-auto lg:mx-0 flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl focus-within:border-violet-400 transition-all"
            >
              <div className="flex-1 flex items-center gap-3 w-full px-3 py-2">
                <Search size={19} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, or categories..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-violet-600 hover:bg-violet-500 active:scale-98 text-white rounded-xl text-sm font-bold shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Quick Trending Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-400">
              <span className="font-medium text-slate-400">Popular:</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() =>
                    router.push(`/products?search=${encodeURIComponent(tag.query)}`)
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href={routes.PRODUCTS}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-102 active:scale-98"
              >
                <span>Browse All Products</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#categories"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-colors"
              >
                <span>Explore Categories</span>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-center sm:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">12+</p>
                <p className="text-xs text-slate-400 mt-0.5">Curated Items</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">Authentic Brands</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">₹0</p>
                <p className="text-xs text-slate-400 mt-0.5">Free Delivery Over ₹499</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Showcase Graphic (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main Featured Showcase Card */}
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-gradient-to-b from-white/15 to-white/5 border border-white/20 p-4 shadow-2xl backdrop-blur-xl group">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
                  alt="Nike Air Max 270 React"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                    Nike Edition
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10">
                  <Star size={13} className="fill-amber-400" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Showcase Card Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">
                    Nike Air Max 270 React
                  </h3>
                  <span className="text-lg font-black text-violet-300">
                    ₹3,499
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-1">
                  Engineered daily comfort with futuristic cushioning.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock • Ready to Ship
                  </span>
                  <Link
                    href="/products?search=Nike"
                    className="text-xs font-bold text-violet-400 hover:text-violet-300 underline"
                  >
                    View Product →
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Trust Badge 1 */}
            <div className="absolute -bottom-4 -left-4 sm:left-2 bg-slate-900/90 border border-white/15 backdrop-blur-xl p-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-600/30 text-violet-400 flex items-center justify-center">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Express Delivery</p>
                <p className="text-[10px] text-slate-400">Dispatched in 24 hours</p>
              </div>
            </div>

            {/* Floating Trust Badge 2 */}
            <div className="absolute -top-4 -right-4 sm:right-2 bg-slate-900/90 border border-white/15 backdrop-blur-xl p-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Genuine</p>
                <p className="text-[10px] text-slate-400">Verified by ShopHub</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
