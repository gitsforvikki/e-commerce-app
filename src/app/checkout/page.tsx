import { OrderSummery } from "@/components/order/OrderSummery";
import { DisplayUser } from "@/components/profile/DisplayUser";
import { PlaceOrderButton } from "@/ui/PlaceOrderButton";
import { routes } from "@/utils/routes";
import { Edit2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href="/cart"
            className="text-muted-foreground hover:text-primary"
          >
            Cart
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">Checkout</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <OrderSummery>
            <PlaceOrderButton />
          </OrderSummery>
          {/* Left Side - Cart Items & Checkout Form */}
          <div className="lg:col-span-2 space-y-8 border border-gray-300 py-6 px-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">
                Account Information
              </h3>
              <Link
                href={routes.PROFILE}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-600 font-bold/80 font-medium transition-colors"
              >
                <Edit2 size={18} />
                Edit
              </Link>
            </div>
            <DisplayUser />
            <div className="flex justify-center">
              <Link
                href={routes.HOME}
                className="bg-violet-600 text-white hover:bg-violet-700 text-center px-7 py-3 rounded-lg flex justify-center w-1/2"
              >
                Shop more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
