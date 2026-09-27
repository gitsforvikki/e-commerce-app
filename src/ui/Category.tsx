"use client";

import { ProductsList } from "@/components/prodocts/ProductsList";
import { ProductType } from "@/type";
import { useState } from "react";

const categories = [
  { name: "MEN", icon: "👨" },
  { name: "WOMEN", icon: "👩" },
  { name: "KIDS", icon: "👶" },
  { name: "ELECTRONICS", icon: "📱" },
  { name: "FASSION", icon: "👕" },
  { name: "HOME", icon: "🏠" },
  { name: "Sports", icon: "⚽" },
  { name: "Books", icon: "📚" },
  { name: "Beauty", icon: "💄" },
];

export const Category = ({ productList }: { productList: ProductType[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredProduct = productList.filter(
    (p) => p.category === selectedCategory,
  );
  const finalProductsToShow =
    filteredProduct.length > 0 ? filteredProduct : productList;

  return (
    <>
      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-slate-900 dark:text-white">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.name ? null : category.name,
                )
              }
              className={`p-6 rounded-2xl text-center transition-all group ${
                selectedCategory === category.name
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800"
              }`}
            >
              <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </p>
              <p className="font-semibold text-sm">{category.name}</p>
            </button>
          ))}
        </div>
        <ProductsList products={finalProductsToShow} />
      </section>
    </>
  );
};
