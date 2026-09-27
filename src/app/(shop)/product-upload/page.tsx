import { UploadProductForm } from "@/components/prodocts/UploadProductForm";
import { redirect } from "next/navigation";
import { getCurrentUserData } from "@/services/user/user.service";

export default async function UploadProduct() {
  const user = await getCurrentUserData();
  if (String(user?.role).toUpperCase() !== "ADMIN") redirect("/");
  return <UploadProductForm />;
}
