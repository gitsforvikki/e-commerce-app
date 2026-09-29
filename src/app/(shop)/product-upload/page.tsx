import { UploadProductForm } from "@/components/prodocts/UploadProductForm";
import { redirect } from "next/navigation";
import { getCurrentUserData } from "@/services/user/user.service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Product | ShopHub Studio",
  description: "Publish and manage products in the ShopHub catalog.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UploadProduct() {
  const user = await getCurrentUserData();
  if (String(user?.role).toUpperCase() !== "ADMIN") redirect("/");
  return <UploadProductForm />;
}
