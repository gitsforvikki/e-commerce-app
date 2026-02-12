import { getLoggedInUser } from "@/lib/auth";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";
import { CartItemUiType } from "@/type";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const OrderSummery = async () => {
  const userInfo = await getLoggedInUser();

  const items: CartItemUiType[] = await getCartItemsFromDB(userInfo?.userId);
  const grandTotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const totalTax = () => {
    return Math.round(grandTotal / 10);
  };
  const shippingAmmount = grandTotal < 1000 ? 50 : 0;
  const payableAmount =
    shippingAmmount > 0
      ? grandTotal + totalTax() + shippingAmmount
      : grandTotal + totalTax();

  return (
    <div className="lg:col-span-1">
      <div className="border border-slate-300 shadow-2xl rounded-lg p-6 sticky top-24 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-foreground/80">
            <span>Subtotal</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-foreground/80">
            <span>Tax (10%)</span>
            <span>₹{totalTax().toFixed(2)}</span>
          </div>
          {shippingAmmount > 0 && (
            <div className="flex justify-between text-foreground/80">
              <span>Shipping</span>
              <span>₹{shippingAmmount.toFixed(2)}</span>
            </div>
          )}
          {shippingAmmount === 0 && grandTotal > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-lg font-bold text-foreground">
            <span>Total</span>
            <span className="text-violet-600 hover:via-violet-700 font-semibold">
              ₹{payableAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {items.length > 0 && (
          <Link
            href="/checkout"
            className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </Link>
        )}

        {grandTotal > 0 && grandTotal < 1000 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              🎉 Free shipping on orders over <strong>1000</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
