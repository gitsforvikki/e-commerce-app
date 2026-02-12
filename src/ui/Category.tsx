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
        <h2 className="text-2xl sm:text-3xl font-bold  mb-8">
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
              className={`p-6 rounded-lg text-center transition-all group ${
                selectedCategory === category.name
                  ? "bg-violet-600 text-white shadow-3xl"
                  : "bg-neutral-200 hover:bg-accent/10 shadow-xl"
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
