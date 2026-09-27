"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductType } from "@/type";
import { ProductCardPro } from "@/components/products/ProductCardPro";
import { routes } from "@/utils/routes";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Layers,
  ChevronRight,
} from "lucide-react";

interface CategoryProps {
  productList: ProductType[];
}

export const Category = ({ productList }: CategoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categoryBanners = [
    {
      id: "MEN",
      title: "Men's Collection",
      subtitle: "Elevate your everyday wardrobe with refined essentials & streetwear.",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      itemCount: productList.filter((p) => p.category === "MEN").length,
      href: "/products?category=men",
      accent: "from-blue-900/90 to-slate-900/90",
    },
    {
      id: "WOMEN",
      title: "Women's Collection",
      subtitle: "Effortless luxury dresses, designer handbags, and chic accessories.",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      itemCount: productList.filter((p) => p.category === "WOMEN").length,
      href: "/products?category=women",
      accent: "from-purple-900/90 to-slate-900/90",
    },
    {
      id: "KIDS",
      title: "Kids & Youth",
      subtitle: "Playful sneakers, durable backpacks, and adventure-ready gear.",
      image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80",
      itemCount: productList.filter((p) => p.category === "KIDS").length,
      href: "/products?category=kids",
      accent: "from-amber-900/90 to-slate-900/90",
    },
  ];

  const filterTabs = [
    { id: "ALL", label: "All Items", icon: "✨" },
    { id: "MEN", label: "Men's", icon: "👔" },
    { id: "WOMEN", label: "Women's", icon: "👗" },
    { id: "KIDS", label: "Kids", icon: "🧸" },
  ];

  // Filter products for the showcase
  const filteredProducts =
    selectedCategory === "ALL"
      ? productList
      : productList.filter(
          (p) => p.category?.toUpperCase() === selectedCategory.toUpperCase(),
        );

  // Showcase up to 8 products
  const displayProducts = filteredProducts.slice(0, 8);

  return (
    <section id="categories" className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ======================================================== */}
        {/* 1. SECTION HEADER */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold mb-3 border border-violet-200/60 dark:border-violet-900/40">
              <Layers size={13} />
              <span>Curated Departments</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Explore hand-picked collections crafted for contemporary lifestyles and modern comfort.
            </p>
          </div>

          <Link
            href={routes.PRODUCTS}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 group"
          >
            <span>View All Categories</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* ======================================================== */}
        {/* 2. RICH VISUAL CATEGORY CARDS */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categoryBanners.map((cat) => (
            <div
              key={cat.id}
              className="group relative rounded-3xl overflow-hidden aspect-4/3 sm:aspect-5/4 shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200/80 dark:border-slate-800"
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.accent} via-slate-900/60 to-transparent transition-opacity`}
              />

              {/* Top Item Count Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  {cat.itemCount} Items
                </span>
              </div>

              {/* Content at Bottom */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col justify-end text-white">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 mt-1.5 opacity-90 leading-relaxed">
                  {cat.subtitle}
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="text-xs font-bold text-violet-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Filter Below</span>
                    <ChevronRight size={14} />
                  </button>

                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold transition-all shadow-sm group-hover:scale-105"
                  >
                    <span>Explore</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* 3. FEATURED PRODUCTS SHOWCASE WITH CATEGORY TABS */}
        {/* ======================================================== */}
        <div className="space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Featured Highlights
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Top rated products available for instant order
              </p>
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCardPro
                key={product._id}
                product={product}
                viewMode="grid"
              />
            ))}
          </div>

          {/* Bottom Explore Full Catalog Banner */}
          <div className="text-center pt-4">
            <Link
              href={
                selectedCategory === "ALL"
                  ? routes.PRODUCTS
                  : `/products?category=${selectedCategory.toLowerCase()}`
              }
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 text-slate-800 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 font-bold text-sm shadow-sm transition-all hover:scale-102"
            >
              <ShoppingBag size={17} />
              <span>
                {selectedCategory === "ALL"
                  ? `Browse All ${productList.length} Products in Catalog`
                  : `Explore Full ${selectedCategory} Collection`}
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
