"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { routes } from "@/utils/routes";
import {
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Lock,
  TestTube,
} from "lucide-react";

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: "_self" | "_blank" | "_top" | "_modal";
}

interface CashfreeInstance {
  checkout: (
    options: CashfreeCheckoutOptions,
  ) => Promise<{ error?: { message: string }; paymentDetails?: unknown }>;
}

type CashfreeSDK = (options: {
  mode: "sandbox" | "production";
}) => CashfreeInstance;

declare global {
  interface Window {
    Cashfree?: CashfreeSDK;
  }
}

function loadCashfreeScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && typeof window.Cashfree === "function") {
      resolve(true);
      return;
    }

    const scriptId = "cashfree-sdk-v3";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (typeof window.Cashfree === "function") {
        resolve(true);
      } else {
        existingScript.addEventListener("load", () => resolve(true), { once: true });
        existingScript.addEventListener("error", () => resolve(false), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CashfreeCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleCashfreePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Load Cashfree official v3 JS SDK
      const scriptLoaded = await loadCashfreeScript();
      if (!scriptLoaded || !window.Cashfree) {
        throw new Error(
          "Unable to load Cashfree payment gateway SDK. Please check your internet connection.",
        );
      }

      // 2. Call server-side API to create order & generate payment session
      const response = await fetch("/api/payments/cashfree/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data: {
        success?: boolean;
        orderId?: string;
        cashfreeOrderId?: string;
        paymentSessionId?: string;
        amount?: number;
        currency?: string;
        environment?: "sandbox" | "production";
        isSandbox?: boolean;
        message?: string;
      } | null = null;

      const rawText = await response.text();
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("[Cashfree Checkout] Non-JSON response:", rawText);
      }

      if (!response.ok || !data?.success || !data?.paymentSessionId) {
        throw new Error(
          data?.message ||
            (response.status === 401
              ? "Your session has expired. Please sign in again."
              : "Unable to start checkout with Cashfree Sandbox. Please check your credentials."),
        );
      }

      // 3. Initialize Cashfree SDK in sandbox mode
      const cashfree = window.Cashfree({
        mode: data.environment === "production" ? "production" : "sandbox",
      });

      // 4. Open Cashfree Checkout Modal
      const checkoutResult = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });

      if (checkoutResult?.error) {
        console.warn("[Cashfree Checkout Modal] User closed or error:", checkoutResult.error);
        setError(checkoutResult.error.message || "Payment was cancelled or dismissed.");
        setLoading(false);
      } else {
        // In modal mode, on completion redirect to local verification page
        router.push(
          `/payment?orderId=${encodeURIComponent(data.orderId || "")}&order_id=${encodeURIComponent(data.cashfreeOrderId || "")}`,
        );
        router.refresh();
      }
    } catch (checkoutError) {
      console.error("[Cashfree Checkout] Error:", checkoutError);
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start Cashfree checkout. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Sandbox Environment Indicator */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
        <span className="inline-flex items-center gap-1.5">
          <TestTube size={13} className="text-amber-600 dark:text-amber-400" />
          <span>Cashfree Sandbox (Test Mode)</span>
        </span>
        <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200">
          Demo
        </span>
      </div>

      {/* Primary Checkout Button */}
      <button
        type="button"
        id="cashfree-pay-now-btn"
        onClick={handleCashfreePayment}
        disabled={loading || authLoading || !user}
        className="w-full bg-violet-600 hover:bg-violet-700 active:scale-99 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-violet-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-101 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Connecting to Cashfree Sandbox…</span>
          </>
        ) : (
          <>
            <Lock size={16} />
            <span>Pay with Cashfree Sandbox</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Trust & Guarantee Micro-text */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
        <ShieldCheck size={13} className="text-emerald-500" />
        <span>Simulated test cards, UPI & Net Banking supported</span>
      </div>

      {/* Error Notification */}
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

      {/* Sign-in prompt for guest users */}
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
}
