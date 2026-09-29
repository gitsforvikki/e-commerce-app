import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Globe2,
  Leaf,
  Store,
} from "lucide-react";
import { routes } from "@/utils/routes";

export const metadata: Metadata = {
  title: "About Us | ShopHub - Modern E-Commerce Experience",
  description:
    "Discover the story behind ShopHub. We curate premium lifestyle essentials, apparel, and electronics with speed, transparency, and top-tier customer care.",
  openGraph: {
    title: "About ShopHub - Curated Quality & Modern Shopping",
    description:
      "Learn about ShopHub's mission to redefine online shopping with ethical sourcing, rapid fulfillment, and customer-first service.",
    type: "website",
  },
};

const STATS = [
  { label: "Active Customers", value: "250K+", change: "+32% this year", icon: Users },
  { label: "Curated Products", value: "15,000+", change: "Hand-inspected", icon: Store },
  { label: "On-Time Delivery", value: "99.8%", change: "Pan-India fulfillment", icon: Truck },
  { label: "Customer Satisfaction", value: "4.9 / 5", change: "Over 80k reviews", icon: Award },
];

const PILLARS = [
  {
    icon: Award,
    title: "Uncompromising Quality",
    description:
      "Every single catalog item undergoes rigorous quality audits. We collaborate only with verified artisans, licensed manufacturers, and certified suppliers.",
    color: "from-amber-500/20 to-orange-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30",
  },
  {
    icon: Truck,
    title: "Lightning Express Delivery",
    description:
      "Strategically positioned regional micro-hubs ensure 24–48 hour dispatch. Real-time GPS tracking keeps you informed from dispatch to doorstep.",
    color: "from-violet-500/20 to-indigo-500/10 text-violet-500 dark:text-violet-400 border-violet-500/30",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Buyer Protection",
    description:
      "State-of-the-art 256-bit SSL encryption, PCI-DSS compliant payment gateways, and hassle-free 7-day replacement policies give you complete peace of mind.",
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: HeartHandshake,
    title: "Human-First Support",
    description:
      "No endless bot loops. Our customer concierge is staffed with dedicated product specialists available 7 days a week to ensure your absolute satisfaction.",
    color: "from-rose-500/20 to-pink-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30",
  },
];

const TIMELINE = [
  {
    year: "2023",
    title: "The Vision Begins",
    description:
      "Founded with a simple premise: online shopping should be transparent, elegant, and devoid of counterfeit or low-quality goods.",
  },
  {
    year: "2024",
    title: "Pan-India Fulfillment Hubs",
    description:
      "Expanded fulfillment across tier-1 cities, slashing average delivery turnaround times by 45% while onboarding 200+ domestic artisans.",
  },
  {
    year: "2025",
    title: "Smart Recommendations & App Launch",
    description:
      "Introduced lightning-fast PWA capabilities, guest-to-account seamless syncing, and automated one-click order tracking.",
  },
  {
    year: "2026 & Beyond",
    title: "Sustainable & Global Commerce",
    description:
      "100% biodegradable packaging initiative and carbon-neutral transit partnerships across all product categories.",
  },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Eco-Conscious Packaging",
    text: "We eliminated single-use plastics from 94% of our packaging in favor of recycled, biodegradable kraft materials.",
  },
  {
    icon: TrendingUp,
    title: "Fair Pricing Always",
    text: "Direct partnerships with creators cut out unnecessary middlemen markups, passing pure savings back to you.",
  },
  {
    icon: Globe2,
    title: "Supporting Local Creators",
    text: "More than 60% of our apparel and handcrafted collections come directly from independent Indian workshops.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-violet-50/50 via-white to-transparent dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/15 dark:bg-violet-600/20 blur-[130px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-violet-600 dark:text-violet-400" />
            Empowering Modern Lifestyles
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Crafted for Quality. <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 dark:from-violet-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent">
              Designed for Modern Living.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ShopHub is an independent e-commerce brand built to bring thoughtfully curated fashion, tech essentials, and lifestyle products straight to your door with zero compromises.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={routes.PRODUCTS}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md hover:shadow-violet-600/20 transition-all group"
            >
              Explore Products
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={routes.CONTACT}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-12 bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all hover:-translate-y-1 hover:border-violet-300 dark:hover:border-violet-700/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stat.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CORE PILLARS ================= */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
            The ShopHub Standard
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built on Integrity, Reliability, and Speed
          </p>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every operational decision we make is guided by four unbreakable principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br border flex items-center justify-center mb-5 ${pillar.color}`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= SUSTAINABILITY & VALUES ================= */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
                >
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                      {val.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {val.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= JOURNEY / MILESTONES ================= */}
      <section className="py-20 md:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
            Our Evolution
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How We Got Here
          </p>
        </div>

        <div className="relative border-l-2 border-violet-200 dark:border-violet-900/60 ml-4 sm:ml-32 space-y-12">
          {TIMELINE.map((item, index) => (
            <div key={index} className="relative pl-8 sm:pl-10">
              {/* Year badge on left */}
              <div className="sm:absolute sm:-left-32 sm:top-0 sm:w-24 sm:text-right font-extrabold text-violet-600 dark:text-violet-400 text-lg mb-1 sm:mb-0">
                {item.year}
              </div>

              {/* Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-violet-600 dark:bg-violet-500 border-4 border-white dark:border-slate-950" />

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-8 sm:p-14 text-white shadow-xl">
          <div
            className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-violet-500/20 blur-[100px] rounded-full pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Verified Authenticity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your Everyday Essentials?
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore our handpicked catalog of apparel, gadgets, and home goods today with fast pan-India shipping and reliable guest checkout.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={routes.PRODUCTS}
                className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-md"
              >
                Browse All Products
              </Link>
              <Link
                href={routes.CONTACT}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
