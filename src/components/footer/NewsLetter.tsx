"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Mail,
  ArrowRight,
  Copy,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const valuePropositions = [
  {
    icon: Truck,
    title: "Free Express Shipping",
    description: "Free standard delivery on all qualifying orders over $50.",
  },
  {
    icon: RotateCcw,
    title: "30-Day Easy Returns",
    description: "Hassle-free return policy with prepaid shipping labels.",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure Checkout",
    description: "Bank-level 256-bit SSL encryption & buyer protection.",
  },
  {
    icon: Headphones,
    title: "24/7 Concierge Support",
    description: "Dedicated support team ready to assist around the clock.",
  },
];

export const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    // Simulate instant responsive feedback
    setTimeout(() => {
      setStatus("success");
      setErrorMessage("");
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("SHOPHUB15");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-16">
      {/* ================= NEWSLETTER & ENGAGEMENT BANNER ================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 p-8 sm:p-10 lg:p-12 border border-slate-800/80 shadow-2xl shadow-black/40 backdrop-blur-sm overflow-hidden">
        <div
          className="absolute -right-16 -bottom-16 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Newsletter Copy */}
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join ShopHub Insider Club</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Unlock 15% off your first order & get VIP access
            </h3>
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
              Be the first to hear about curated product drops, secret flash
              sales, and exclusive weekly editorial picks.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-6">
            {status === "success" ? (
              <div className="p-5 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Welcome to the club! 🎉
                    </p>
                    <p className="text-xs text-slate-400">
                      Use voucher code below at checkout:
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="font-mono text-sm px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-violet-300 font-bold tracking-wider">
                    SHOPHUB15
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                    title="Copy promo code"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="Enter your email address..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      aria-label="Email address for newsletter"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold shadow-lg shadow-violet-600/25 transition-all duration-200 cursor-pointer disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <span>Subscribing...</span>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
                {status === "error" ? (
                  <p className="text-xs text-rose-400 font-medium pl-1">
                    {errorMessage}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 pl-1">
                    🔒 No spam, ever. Unsubscribe with a single click at any
                    time.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ================= TRUST & VALUE PROPOSITIONS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {valuePropositions.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-violet-500/30 hover:bg-slate-900/70 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-violet-500/20 transition-all duration-200">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsLetter;
