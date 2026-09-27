import { Suspense } from "react";
import { getProductById } from "@/services/product.services";
import ProductDetails from "@/components/prodocts/ProductDetails";
import ProductDetailsSkeleton from "@/simmerUi/productDetailsSimmer";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductById(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductById(slug);
  if (!product) notFound();

  return (
    <>
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails product={product} />
      </Suspense>
    </>
  );
}
