import { ProductCard } from "@/components/prodocts/ProductCard";
import { getAllProducts } from "@/services/product.services";
import { ProductType } from "@/type";
import { Category } from "@/ui/Category";
import { Features } from "@/ui/Features";
import { HeroPage } from "@/ui/hero-section/Hero";
import { Offer } from "@/ui/Offer";

export default async function HomePage() {
  const products: ProductType[] = await getAllProducts();
  return (
    <>
      <HeroPage />
      <Category productList={products} />
      <Features />
      <Offer />
    </>
  );
}
