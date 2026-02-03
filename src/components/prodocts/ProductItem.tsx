import { ProductType } from "@/type";
import Link from "next/link";

export const ProductItem = ({ product }: { product: ProductType }) => {
  const { name, image, price, description, category, _id } = product ?? {};
  const categoryPath = category?.toLowerCase().replace(/\s+/g, "-") || "";
  return (
    <>
      <Link
        href={`/${categoryPath}/${_id}`}
        className="border rounded-lg p-4 shadow-md"
      >
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-md"
          width={400}
          height={300}
        />
        <h2 className="text-xl font-semibold mt-2">{name}</h2>
        <p className="text-gray-600">{description}</p>
        <p className="text-lg font-bold mt-2">${price}</p>
      </Link>
    </>
  );
};
