import { Suspense } from "react";
import { getProductById } from "@/services/product.services";
import { ProductType } from "@/type";
import ProductDetails from "@/components/prodocts/ProductDetails";
import ProductDetailsSkeleton from "@/simmerUi/productDetailsSimmer";

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
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails product={product} />
      </Suspense>
    </>
  );
}
