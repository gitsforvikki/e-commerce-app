import { getAllProducts } from "@/services/product.services";
import { ProductType } from "@/type";

export default async function HomePage() {
  const products: ProductType[] = await getAllProducts();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold underline">Welcome to the Shop!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {products.map((product) => (
          <div key={product?._id} className="border rounded-lg p-4 shadow-md">
            <img
              src={product?.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
              width={400}
              height={300}
            />
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product?.description}</p>
            <p className="text-lg font-bold mt-2">${product?.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
