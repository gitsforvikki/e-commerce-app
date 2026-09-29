"use server";

import { requireRole, AccessDeniedError } from "@/lib/access-control";
import {
  uploadProduct,
  updateProduct,
  deleteProduct,
} from "@/services/product.services";
import { productSchemaValidator } from "@/validators/productSchemaValidator";
import { routes } from "@/utils/routes";
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

// ── Helper: extract & validate product form data ────────────────────

function extractProductData(formData: FormData) {
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

  // Validate Cloudinary image URL
  if (typeof rawProduct.image !== "string") {
    return { error: "A valid product image is required" };
  }
  try {
    const imageUrl = new URL(rawProduct.image);
    if (
      imageUrl.protocol !== "https:" ||
      imageUrl.hostname !== "res.cloudinary.com" ||
      !imageUrl.pathname.includes("/products/")
    ) {
      return { error: "Select a valid uploaded product image" };
    }
  } catch {
    return { error: "Invalid image URL" };
  }

  // Validate with Zod
  const validated = productSchemaValidator.safeParse(rawProduct);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  return { data: validated.data };
}

// ── Add product (ADMIN only) ────────────────────────────────────────

export async function addProduct(
  prevState: ProductFormState,
  formData: FormData,
) {
  try {
    await requireRole("ADMIN");

    const parsed = extractProductData(formData);
    if ("error" in parsed) return { success: false, error: parsed.error };
    if ("errors" in parsed) return { success: false, errors: parsed.errors };

    const uploadResult = await uploadProduct(parsed.data);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to add product" };
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/");
}

// ── Edit product (ADMIN only) ───────────────────────────────────────

export async function editProduct(
  prevState: ProductFormState,
  formData: FormData,
) {
  const productId = formData.get("productId") as string;
  if (!productId) {
    return { success: false, error: "Product ID is required" };
  }

  let targetCategory = "";

  try {
    await requireRole("ADMIN");

    const parsed = extractProductData(formData);
    if ("error" in parsed) return { success: false, error: parsed.error };
    if ("errors" in parsed) return { success: false, errors: parsed.errors };

    targetCategory = parsed.data.category;

    const result = await updateProduct(productId, parsed.data);
    if (!result.success) {
      return { success: false, error: result.error };
    }
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update product" };
  }

  revalidatePath("/");
  revalidatePath("/products");
  if (targetCategory) {
    revalidatePath(`/${targetCategory.toLowerCase()}/${productId}`);
  }
  redirect(
    targetCategory
      ? routes.SPECIFIC_PRODUCT(targetCategory, productId)
      : "/products",
  );
}

// ── Delete product (ADMIN only) ─────────────────────────────────────

export async function deleteProductAction(productId: string) {
  try {
    await requireRole("ADMIN");

    const result = await deleteProduct(productId);
    if (!result.success) {
      return { success: false, error: result.error };
    }
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete product" };
  }

  revalidatePath("/");
  revalidatePath("/products");
  return { success: true };
}

