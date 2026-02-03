import { ProductItem } from "@/components/prodocts/ProductItem";
import { getAllProducts } from "@/services/product.services";
import { ProductType } from "@/type";

export default async function HomePage() {
  const products: ProductType[] = await getAllProducts();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold underline">Welcome to the Shop!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
