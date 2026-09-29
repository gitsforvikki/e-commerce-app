import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, UserCheck, ArrowRight, HelpCircle } from "lucide-react";
import { routes } from "@/utils/routes";

export const metadata: Metadata = {
  title: "Privacy Policy | ShopHub",
  description: "Learn how ShopHub collects, protects, and handles your personal information with full transparency.",
};

const SECTIONS = [
  {
    icon: Lock,
    title: "1. Information We Collect",
    content:
      "When you create an account, browse, or place an order, we collect essential details such as your name, email, phone number, and delivery address. Payment details (cards, UPI IDs) are processed directly by RBI-authorized payment gateways and are never stored on our servers.",
  },
  {
    icon: UserCheck,
    title: "2. How We Use Your Information",
    content:
      "Your information is strictly used to fulfill and track your orders, send order confirmations and delivery updates, prevent fraudulent transactions, and deliver customer support when requested.",
  },
  {
    icon: EyeOff,
    title: "3. Zero Data Selling Policy",
    content:
      "We never sell, rent, or monetize your personal information to third parties or advertisers. We only share delivery details with verified courier partners (e.g., Delhivery, BlueDart) to get your items safely to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "4. Your Rights & Data Control",
    content:
      "You have full ownership of your data. You can inspect or update your account information anytime from your profile, or contact our support team to request complete account and data deletion.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 md:py-16 text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={14} />
            Transparency First
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last updated: September 2026 • Effective immediately
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-4">
          {SECTIONS.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {sec.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                  {sec.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="p-6 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle size={22} className="text-violet-600 dark:text-violet-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Have questions about your privacy?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Our support team is happy to explain how we handle your data.
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
