import { Metadata } from "next";
import Link from "next/link";
import { Cookie, CheckCircle2, Sliders, Shield, ArrowRight, HelpCircle } from "lucide-react";
import { routes } from "@/utils/routes";

export const metadata: Metadata = {
  title: "Cookie Policy & Settings | ShopHub",
  description: "Learn how ShopHub uses cookies to power your shopping cart, preserve your theme preferences, and protect your session.",
};

const COOKIE_TYPES = [
  {
    icon: Shield,
    title: "1. Strictly Essential Cookies",
    badge: "Always Active",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    content:
      "These cookies are necessary for ShopHub to function. They keep you logged in securely, preserve items in your guest cart while browsing, and authenticate checkout sessions.",
  },
  {
    icon: Sliders,
    title: "2. Preference & Customization Cookies",
    badge: "Optional / Functional",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    content:
      "These cookies remember your personalized interface preferences, such as your Dark/Light theme mode setting, so you don't have to reconfigure them on every visit.",
  },
  {
    icon: Cookie,
    title: "3. How You Can Manage Cookies",
    badge: "Browser Control",
    badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    content:
      "You can block or delete cookies anytime through your web browser settings. Note that disabling essential cookies may prevent items from staying in your cart or prevent sign-in.",
  },
];

export default function CookiePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 md:py-16 text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Cookie size={14} />
            Data Preferences
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cookie Settings & Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last updated: September 2026 • We respect your privacy
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-4">
          {COOKIE_TYPES.map((cookie, i) => {
            const Icon = cookie.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {cookie.title}
                    </h2>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cookie.badgeColor}`}
                  >
                    {cookie.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                  {cookie.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary note */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          <span>
            ShopHub does not use third-party invasive tracking cookies or sell your browsing history to advertising networks.
          </span>
        </div>

        {/* Support Banner */}
        <div className="p-6 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle size={22} className="text-violet-600 dark:text-violet-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Questions regarding our cookie practices?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Our team is happy to address any questions you have.
              </p>
            </div>
          </div>
          <Link
            href={routes.CONTACT}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
          >
            Contact Support
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
