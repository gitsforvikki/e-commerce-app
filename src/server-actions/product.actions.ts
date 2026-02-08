"use server";

import { getLoggedInUser } from "@/lib/auth";
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
    stock?: string[];
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
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    //collect form data and create product object
    const rawProduct = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      qty: Number(formData.get("qty")),
      brand: formData.get("brand") as string,
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
      usage: formData.get("usage") as string,
    };

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
  } catch (error) {
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
