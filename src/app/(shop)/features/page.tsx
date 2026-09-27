import { Metadata } from "next";
import Link from "next/link";
import { Features } from "@/ui/Features";
import { routes } from "@/utils/routes";
import { ArrowRight, ShoppingBag, CheckCircle, ShieldCheck, HeartHandshake, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Why ShopHub - Premium Features & Guarantees",
  description:
    "Explore ShopHub customer-first guarantees including free express shipping, 30-day returns, bank-grade encryption, and 100% verified genuine products.",
};

export default function FeaturesPage() {
  const comparisonList = [
    { feature: "Certified 100% Authentic Products", shophub: true, others: "Hit or Miss" },
    { feature: "Free Express Shipping > ₹499", shophub: true, others: "High Thresholds" },
    { feature: "30-Day Instant Doorstep Returns", shophub: true, others: "Complex 7-day limits" },
    { feature: "Bank-Grade 256-Bit SSL Protection", shophub: true, others: "Basic Encryption" },
    { feature: "Direct Brand Manufacturer Warranty", shophub: true, others: "Seller Discretion" },
    { feature: "Dedicated 24/7 Priority Support", shophub: true, others: "Automated Bots" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold backdrop-blur-md">
            <Zap size={14} className="text-violet-400" />
            <span>The ShopHub Standard</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto">
            Engineered to Deliver an Unmatched Shopping Journey.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every feature on ShopHub is designed around your convenience, transparency, and confidence. Here is why discerning shoppers trust us every single day.
          </p>

          <div className="pt-2">
            <Link
              href={routes.PRODUCTS}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/25 transition-all hover:scale-102"
            >
              <ShoppingBag size={18} />
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded Features Component */}
      <Features />

      {/* Trust Comparison Table */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold mb-2">
            <HeartHandshake size={13} />
            <span>The Difference</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How ShopHub Stands Apart
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-100 dark:bg-slate-800/80 px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <div className="col-span-6 sm:col-span-7">Feature & Guarantee</div>
            <div className="col-span-3 sm:col-span-3 text-center text-violet-600 dark:text-violet-400 font-extrabold">ShopHub</div>
            <div className="col-span-3 sm:col-span-2 text-center text-slate-500">Other Stores</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {comparisonList.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-6 sm:col-span-7 font-semibold text-slate-800 dark:text-slate-200">
                  {item.feature}
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center text-emerald-500 font-bold">
                  <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={14} />
                    <span className="hidden sm:inline">Guaranteed</span>
                  </span>
                </div>
                <div className="col-span-3 sm:col-span-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {item.others}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
