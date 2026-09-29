import { Metadata } from "next";
import Link from "next/link";
import { FileText, ShoppingBag, RotateCcw, CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";
import { routes } from "@/utils/routes";

export const metadata: Metadata = {
  title: "Terms of Service | ShopHub",
  description: "Review the clear and fair terms governing your use of ShopHub and orders placed through our store.",
};

const TERMS = [
  {
    icon: FileText,
    title: "1. Account & Eligibility",
    content:
      "By creating an account or placing an order on ShopHub, you confirm that you are at least 18 years old or browsing with parent/guardian consent. You are responsible for keeping your login credentials confidential.",
  },
  {
    icon: ShoppingBag,
    title: "2. Orders & Fair Pricing",
    content:
      "All product listings are invitations to offer. An order is confirmed when you receive an order confirmation notification. While we strive for 100% pricing precision, in the rare event of a clear technical pricing glitch, we reserve the right to cancel the order and provide a full refund.",
  },
  {
    icon: RotateCcw,
    title: "3. Returns, Replacements & Refunds",
    content:
      "We provide a 7-day hassle-free return and exchange policy on eligible merchandise. Returned items must be unwashed, unused, and returned in their original packaging with all tags attached. Refunds are processed to the original payment source within 3–5 business days after inspection.",
  },
  {
    icon: CheckCircle2,
    title: "4. User Conduct & Integrity",
    content:
      "Users agree not to exploit site vulnerabilities, engage in unauthorized scraping, or submit fraudulent transactions. Any account found engaging in abusive activity will be terminated immediately.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 md:py-16 text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <FileText size={14} />
            User Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last updated: September 2026 • Simple & straightforward
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-4">
          {TERMS.map((term, i) => {
            const Icon = term.icon;
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
                    {term.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                  {term.content}
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
                Need clarification on any policy?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Our support team is here to assist with any questions or order disputes.
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
