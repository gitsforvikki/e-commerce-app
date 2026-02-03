import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { ProductType } from "@/type";

export async function getAllProducts(): Promise<ProductType[]> {
  try {
    //connect to db
    await connectDB();
    //fetch products from db
    const products = await Product.find();
    return products.map((product) => ({
      ...product.toObject(),
      _id: product._id.toString(),
    }));
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
