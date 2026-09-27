"use client";

import { useAuth } from "@/context/auth-context";
import {
  PlaceOrderActions,
  verifyPaymentAction,
} from "@/server-actions/placeOrder.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      if (!scriptLoaded)
        throw new Error("Unable to load secure payment checkout");

      const checkout = await PlaceOrderActions();
      const Razorpay = (
        window as Window & {
          Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
        }
      ).Razorpay;
      if (!Razorpay) throw new Error("Payment checkout is unavailable");

      const instance = new Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "ShopHub",
        description: "Secure order payment",
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
    <div className="space-y-2">
      <button
        onClick={handlePlaceOrder}
        disabled={loading || authLoading || !user}
        className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Preparing secure checkout…" : "Pay securely"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!authLoading && !user && (
        <p className="text-sm text-red-600">Sign in to place an order.</p>
      )}
    </div>
  );
};
