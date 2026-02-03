import { Suspense } from "react";
import { ProductItem } from "@/components/prodocts/ProductItem";
import { getProductById } from "@/services/product.services";
import { ProductType } from "@/type";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = (await getProductById(slug)) as ProductType;

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
  const product = (await getProductById(slug)) as ProductType;

  return (
    <>
      <Suspense fallback={<div>Loading product details...</div>}>
        <ProductItem product={product} />
      </Suspense>
    </>
  );
}
