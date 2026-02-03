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

export async function getProductById(
  productId: string,
): Promise<ProductType | null> {
  try {
    //connect to db
    await connectDB();
    //fetch product from db
    const product = await Product.findById(productId);
    if (!product) {
      return null;
    }
    return {
      ...product.toObject(),
      _id: product._id.toString(),
    };
  } catch (error: any) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product by ID");
  }
}

//get products by category
export async function getProductsByCategory(
  category: string,
): Promise<ProductType[]> {
  try {
    //connect to db
    await connectDB();
    //fetch products from db
    const products = await Product.find({ category });
    return products.map((product) => ({
      ...product.toObject(),
      _id: product._id.toString(),
    }));
  } catch (error: any) {
    console.error("Error fetching products by category:", error);
    throw new Error("Failed to fetch products by category");
  }
}
