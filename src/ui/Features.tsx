import { Truck, RotateCcw, ShieldCheck, Award, CheckCircle2 } from "lucide-react";

export const Features = () => {
  const perks = [
    {
      icon: Truck,
      badge: "Express Priority",
      title: "Free Express Shipping",
      description: "Complimentary priority delivery across 19,000+ pin codes on all orders over ₹499.",
      guarantee: "Live GPS Tracking Included",
      color: "bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800/50",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/40",
    },
    {
      icon: RotateCcw,
      badge: "Zero Questions",
      title: "30-Day Easy Returns",
      description: "Hassle-free doorstep pickup with instant automated refund to UPI or original card.",
      guarantee: "100% Full Refund Guarantee",
      color: "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/40",
    },
    {
      icon: ShieldCheck,
      badge: "256-Bit SSL",
      title: "Bank-Grade Security",
      description: "Encrypted transactions supporting UPI, RuPay, Visa, Mastercard, Net Banking, & EMI.",
      guarantee: "PCI-DSS Level 1 Certified",
      color: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40",
    },
    {
      icon: Award,
      badge: "Brand Certified",
      title: "100% Authentic Goods",
      description: "Direct brand sourcing with genuine warranty coverage and certificate of authenticity.",
      guarantee: "Official Brand Manufacturer",
      color: "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-950 border-y border-slate-200/90 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold mb-3 border border-violet-200/80 dark:border-violet-900/40">
            <ShieldCheck size={14} className="text-violet-600 dark:text-violet-400" />
            <span>The ShopHub Assurance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Millions Shop With Confidence
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            From doorstep express dispatch to frictionless returns, every single order is backed by our customer-first promises.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-50/70 hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-violet-400/60 dark:hover:border-violet-500/50 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs ${perk.color}`}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${perk.badgeColor}`}
                    >
                      {perk.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {perk.description}
                  </p>
                </div>

                {/* Bottom Trust Guarantee */}
                <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{perk.guarantee}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
