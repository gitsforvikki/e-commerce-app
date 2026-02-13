import { logoutAndUpdateCookiesCart } from "@/server-actions/cart.action";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await logoutAndUpdateCookiesCart();
    (await cookies()).delete("token");
    return new Response("Logged out successfully", { status: 200 });
  } catch (error) {
    console.error("Error during logout:", error);
    return new Response("Failed to log out", { status: 500 });
  }
}
