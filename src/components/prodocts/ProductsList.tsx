import { ProductType } from "@/type";
import { ProductCard } from "./ProductCard";

interface ProductListType {
  products: ProductType[];
}

export const ProductsList = ({ products }: ProductListType) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {products.map((product: ProductType) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
};
