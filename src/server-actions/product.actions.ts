"use server";

import { requireRole } from "@/lib/access-control";
import { uploadProduct } from "@/services/product.services";
import { productSchemaValidator } from "@/validators/productSchemaValidator";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProductFormState = {
  success: boolean;
  errors?: {
    name?: string[];
    price?: string[];
    image?: string[];
    qty?: string[];
    brand?: string[];
    category?: string[];
    description?: string[];
    usage?: string[];
  };
  error?: string;
};

//Add product
export async function addProduct(
  prevState: ProductFormState,
  formData: FormData,
) {
  try {
    await requireRole("ADMIN");
    //collect form data and create product object
    const rawProduct = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      qty: Number(formData.get("qty")),
      brand: formData.get("brand") as string,
      category: formData.get("category") as string,
      usage: formData.get("usage") as string,
    };
    if (typeof rawProduct.image !== "string") {
      return { success: false, error: "A valid product image is required" };
    }
    const imageUrl = new URL(rawProduct.image);
    if (
      imageUrl.protocol !== "https:" ||
      imageUrl.hostname !== "res.cloudinary.com" ||
      !imageUrl.pathname.includes("/products/")
    ) {
      return { success: false, error: "Select a valid uploaded product image" };
    }
    //validate form data
    const validatedProduct = productSchemaValidator.safeParse(rawProduct);
    if (!validatedProduct.success) {
      return {
        success: false,
        errors: validatedProduct.error.flatten().fieldErrors,
      };
    }

    const product = validatedProduct.data;
    //db action to upload product
    const uploadResult = await uploadProduct(product);
    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error,
      };
    }
  } catch {
    return {
      success: false,
      error: "Failed to add product",
    };
  }

  //Invalidate cache
  revalidatePath("/");

  //Redirect (server-side)
  redirect("/");
}
