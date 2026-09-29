import { EditProductForm } from "@/components/prodocts/EditProductForm";
import { getProductById } from "@/services/product.services";
import { getCurrentUserData } from "@/services/user/user.service";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product | ShopHub Studio",
  description: "Update and manage product details in the ShopHub catalog.",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Guard: Server-side check for ADMIN role
  const user = await getCurrentUserData();
  if (String(user?.role).toUpperCase() !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
