import Link from "next/link";
import { routes } from "@/utils/routes";
import {
  Compass,
  Home,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Search,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | ShopHub",
  description:
    "Sorry, the page you're looking for cannot be found. Browse our catalog or return to the homepage.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const popularCategories = [
    {
      title: "Men's Collection",
      href: routes.MENS,
      description: "Tailored apparel, shoes, and street gear",
      badge: "Trending",
    },
    {
      title: "Women's Collection",
      href: routes.WOMENS,
      description: "Designer styles, handbags, and luxury",
      badge: "Popular",
    },
    {
      title: "Kids & Youth",
      href: routes.KIDS,
      description: "Playful, comfortable outfits and essentials",
      badge: "New",
    },
    {
      title: "All Products",
      href: routes.PRODUCTS,
      description: "Browse the entire catalog with filters",
      badge: "Full Catalog",
    },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-950 transition-colors duration-200">
      <div className="w-full max-w-3xl text-center space-y-10">
        {/* ── Visual 404 Glow & Badge ── */}
        <div className="relative inline-flex flex-col items-center">
          {/* Subtle Ambient Glow */}
          <div
            aria-hidden="true"
            className="absolute -inset-8 bg-gradient-to-r from-violet-600/20 via-fuchsia-500/20 to-indigo-600/20 rounded-full blur-3xl opacity-70 pointer-events-none"
          />

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50 shadow-2xs mb-4">
            <Compass className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>404 • Page Not Found</span>
          </div>

          {/* Large Stylized 404 Number */}
          <h1 className="relative text-7xl sm:text-9xl font-black tracking-tight bg-gradient-to-b from-slate-900 via-violet-950 to-slate-700 dark:from-white dark:via-violet-200 dark:to-slate-400 bg-clip-text text-transparent select-none">
            404
          </h1>
        </div>

        {/* ── Message & Explanatory Text ── */}
        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Lost in the Catalog?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            The page, category, or product you requested might have been moved,
            renamed, or is temporarily unavailable. Let&apos;s get you back to discovering great products.
          </p>
        </div>

        {/* ── Search Bar on 404 ── */}
        <div className="max-w-md mx-auto">
          <form
            action={routes.PRODUCTS}
            method="GET"
            className="relative flex items-center"
          >
            <Search className="absolute left-4 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="search"
              placeholder="Search products, brands, or categories..."
              className="w-full pl-11 pr-24 py-3.5 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-3.5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* ── Primary Action CTAs ── */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={routes.HOME}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
          <Link
            href={routes.PRODUCTS}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore All Products</span>
          </Link>
        </div>

        {/* ── Popular Category Suggestions ── */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            <span>Popular Destinations</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {popularCategories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-violet-300 dark:hover:border-violet-600/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {cat.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
