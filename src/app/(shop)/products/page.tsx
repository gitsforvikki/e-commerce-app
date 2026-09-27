import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/services/product.services";
import { ProductsPageClient } from "@/components/products/ProductsPageClient";
import { ProductPageSkeleton } from "@/components/products/ProductPageSkeleton";
import { ProductType } from "@/type";

export const metadata: Metadata = {
  title: "All Products - Explore Our Catalog | ShopHub",
  description:
    "Shop our full collection of premium products across fashion, electronics, accessories, and more. Filter by brand, category, price, and stock availability.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage() {
  let products: ProductType[] = [];

  try {
    products = await getAllProducts();
  } catch (error) {
    console.error("Failed to load products for /products page:", error);
  }

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductsPageClient initialProducts={products} />
    </Suspense>
  );
}
