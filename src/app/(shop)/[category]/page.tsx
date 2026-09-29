import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, normalizeCategory } from "@/services/product.services";
import { ProductsPageClient } from "@/components/products/ProductsPageClient";
import { ProductPageSkeleton } from "@/components/products/ProductPageSkeleton";
import { ProductType } from "@/type";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<
  "MEN" | "WOMEN" | "KIDS",
  {
    title: string;
    description: string;
    badge: string;
    tagline: string;
  }
> = {
  MEN: {
    title: "Men's Collection",
    description:
      "Explore contemporary men's fashion, footwear, electronics, and lifestyle essentials curated for style and performance.",
    badge: "Men's Studio",
    tagline:
      "Precision tailoring, modern street essentials, and cutting-edge fashion built for every moment.",
  },
  WOMEN: {
    title: "Women's Collection",
    description:
      "Shop luxury women's designer apparel, chic handbags, premium accessories, and seasonal fashion statements.",
    badge: "Women's Designer",
    tagline:
      "Elegance redefined with designer luxury, chic apparel, and seasonal trends tailored for modern sophistication.",
  },
  KIDS: {
    title: "Kids & Youth Collection",
    description:
      "Discover comfortable, vibrant, and durable apparel, footwear, and gear designed for active kids and youth.",
    badge: "Kids & Youth",
    tagline:
      "Vibrant, durable everyday wear and playful styles built for non-stop comfort and everyday adventures.",
  },
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const normalized = normalizeCategory(category);

  if (!normalized) {
    return {
      title: "Category Not Found | ShopHub",
      description: "The requested category could not be found.",
    };
  }

  const meta = CATEGORY_META[normalized];

  return {
    title: `${meta.title} - Shop Online | ShopHub`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | ShopHub`,
      description: meta.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const normalized = normalizeCategory(category);

  // If the category slug is not recognized (e.g. /random-path), trigger 404
  if (!normalized) {
    notFound();
  }

  const meta = CATEGORY_META[normalized];
  let products: ProductType[] = [];

  try {
    products = await getAllProducts();
  } catch (error) {
    console.error(`Failed to load products for category ${category}:`, error);
  }

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductsPageClient
        initialProducts={products}
        defaultCategory={normalized}
        categoryTitle={meta.title}
        categoryTagline={meta.tagline}
        categoryBadge={meta.badge}
        isCategoryPage={true}
      />
    </Suspense>
  );
}
