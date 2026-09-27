"use client";

import { useAuth } from "@/context/auth-context";
import {
  PlaceOrderActions,
  verifyPaymentAction,
} from "@/server-actions/placeOrder.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { routes } from "@/utils/routes";
import { ShieldCheck, AlertCircle, Loader2, ArrowRight, Lock } from "lucide-react";

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  modal: { ondismiss: () => void };
};

type RazorpayInstance = { open: () => void };

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (document.querySelector("script[data-razorpay-checkout]")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const PlaceOrderButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load secure payment gateway. Please check your internet connection.");
      }

      const checkout = await PlaceOrderActions();
      const Razorpay = (
        window as Window & {
          Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
        }
      ).Razorpay;

      if (!Razorpay) {
        throw new Error("Payment gateway is temporarily unavailable. Please retry.");
      }

      const instance = new Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "ShopHub",
        description: "Secure Order Checkout",
        order_id: checkout.providerOrderId,
        prefill: checkout.customer,
        handler: async (response) => {
          try {
            await verifyPaymentAction({
              orderId: checkout.orderId,
              providerOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            router.replace(`/payment?orderId=${checkout.orderId}`);
            router.refresh();
          } catch (paymentError) {
            setError(
              paymentError instanceof Error
                ? paymentError.message
                : "Payment verification failed",
            );
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      instance.open();
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout",
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Primary Checkout Button */}
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={loading || authLoading || !user}
        className="w-full bg-violet-600 hover:bg-violet-700 active:scale-99 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-violet-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-101 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Preparing Secure Payment…</span>
          </>
        ) : (
          <>
            <Lock size={16} />
            <span>Place Order & Pay Securely</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle size={16} className="shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            {error.toLowerCase().includes("address") && (
              <Link
                href={routes.PROFILE}
                className="mt-1.5 inline-block font-bold text-violet-600 dark:text-violet-400 underline"
              >
                Go to Profile to complete address →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Auth Prompt if Not Signed In */}
      {!authLoading && !user && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
            <AlertCircle size={16} className="shrink-0 text-amber-600" />
            <span>Sign in to complete order</span>
          </div>
          <Link
            href={routes.LOGIN}
            className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            Sign In Now
          </Link>
        </div>
      )}
    </div>
  );
};
