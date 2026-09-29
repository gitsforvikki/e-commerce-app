"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
} from "lucide-react";
import { routes } from "@/utils/routes";
import { NewsLetter } from "@/components/footer/NewsLetter";

interface FooterLink {
  name: string;
  link: string;
  badge?: string;
  badgeClass?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Shop Categories",
    links: [
      { name: "All Products", link: routes.PRODUCTS },
      {
        name: "New Arrivals",
        link: routes.PRODUCTS,
        badge: "New",
        badgeClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      },
      {
        name: "Trending Deals",
        link: routes.PRODUCTS,
        badge: "Hot",
        badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      },

      { name: "Fashion & Lifestyle", link: routes.PRODUCTS },
      {
        name: "Clearance Sale",
        link: routes.PRODUCTS,
        badge: "-40%",
        badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { name: "Track Your Order", link: routes.ORDER },
      { name: "Contact Support", link: routes.CONTACT },
      { name: "View Shopping Cart", link: routes.CART },
      { name: "Direct Email", link: "mailto:support@shophub.com" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About ShopHub", link: routes.ABOUT },
      { name: "Affiliate Program", link: "#affiliates" },
      { name: "Store Locator", link: "#stores" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { name: "Privacy Policy", link: "#privacy" },
      { name: "Terms of Service", link: "#terms" },
      { name: "Cookie Settings", link: "#cookie" },
    ],
  },
];

export const Footer = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800/80 overflow-hidden selection:bg-violet-500/30 selection:text-white">
      {/* Top Ambient Glow / Lighting Accents */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[160px] bg-violet-600/15 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 right-0 w-[400px] h-[300px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ================= NEWSLETTER & VALUE PROPOSITIONS ================= */}
        <NewsLetter />

        {/* ================= MAIN NAVIGATION LINKS & BRAND ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-10 pt-4">
          {/* Brand Info (Spans 2 columns on lg screens) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link
              href={routes.HOME}
              className="inline-flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-extrabold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Shop<span className="text-violet-400">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your modern destination for premium curated electronics, designer
              fashion, and lifestyle essentials. Designed for elegance, built
              for daily performance.
            </p>

            {/* Direct Contact Points */}
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5 hover:text-slate-200 transition-colors">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <a href="mailto:support@shophub.com">support@shophub.com</a>
              </div>
              <div className="flex items-center gap-2.5 hover:text-slate-200 transition-colors">
                <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                <a href="tel:+91 6201448872">
                  +91 62014 48872 (Mon–Fri, 9am–6pm)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Connect with us
              </p>
              <div className="flex items-center gap-2">
                {[
                  {
                    href: "https://twitter.com",
                    label: "Follow ShopHub on Twitter",
                    icon: Twitter,
                  },
                  {
                    href: "https://instagram.com",
                    label: "Follow ShopHub on Instagram",
                    icon: Instagram,
                  },
                  {
                    href: "https://facebook.com",
                    label: "Follow ShopHub on Facebook",
                    icon: Facebook,
                  },
                  {
                    href: "https://youtube.com",
                    label: "Follow ShopHub on YouTube",
                    icon: Youtube,
                  },
                  {
                    href: "https://github.com/gitsforvikki",
                    label: "Follow ShopHub on GitHub",
                    icon: Github,
                  },
                  {
                    href: "https://linkedin.com",
                    label: "Follow ShopHub on LinkedIn",
                    icon: Linkedin,
                  },
                ].map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mapped Navigation Columns */}
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {column.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {column.links.map((item) => {
                  const isExternal =
                    item.link.startsWith("mailto:") ||
                    item.link.startsWith("http") ||
                    item.link.startsWith("#");
                  const linkClasses =
                    "hover:text-violet-400 transition-colors inline-flex items-center gap-2";

                  const content = (
                    <>
                      <span>{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md border ${
                            item.badgeClass ||
                            "bg-violet-500/20 text-violet-300 border-violet-500/30"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  );

                  return (
                    <li key={item.name}>
                      {isExternal ? (
                        <a href={item.link} className={linkClasses}>
                          {content}
                        </a>
                      ) : (
                        <Link href={item.link} className={linkClasses}>
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* ================= BOTTOM BAR & PAYMENT BADGES ================= */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright & Live Status */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} ShopHub Inc. All rights
              reserved.
            </p>
            <span className="hidden sm:inline text-slate-700">•</span>
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <p>
              Made with ❤️ by{" "}
              <Link
                href="/"
                className="text-slate-300 hover:text-white font-medium underline underline-offset-4 decoration-violet-500/50 hover:decoration-violet-400 transition-colors"
              >
                gitsforvikki
              </Link>
            </p>
          </div>

          {/* Payment Badges & Back to Top */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            {/* Payment Method Badges */}
            <div
              className="flex items-center gap-1.5"
              aria-label="Accepted Payment Methods"
            >
              {/* Visa */}
              <div
                className="h-7 px-2.5 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center text-[11px] font-bold text-slate-200 tracking-wider shadow-sm hover:border-slate-700 transition-colors"
                title="Visa"
              >
                VISA
              </div>
              {/* Mastercard */}
              <div
                className="h-7 px-2 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center gap-0.5 shadow-sm hover:border-slate-700 transition-colors"
                title="Mastercard"
              >
                <div className="w-3 h-3 rounded-full bg-rose-500 opacity-90 -mr-1" />
                <div className="w-3 h-3 rounded-full bg-amber-500 opacity-90" />
              </div>
              {/* AMEX */}
              <div
                className="h-7 px-2 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center text-[10px] font-black text-sky-400 tracking-tight shadow-sm hover:border-slate-700 transition-colors"
                title="American Express"
              >
                AMEX
              </div>
              {/* Apple Pay */}
              <div
                className="h-7 px-2 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center text-[11px] font-semibold text-white tracking-tight shadow-sm hover:border-slate-700 transition-colors"
                title="Apple Pay"
              >
                <svg
                  className="w-3 h-3 fill-current mr-0.5"
                  viewBox="0 0 170 170"
                >
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.98-5.77-8.91-10.4-19.1-13.88-30.56-3.48-11.46-5.22-22.18-5.22-32.16 0-14.52 3.63-26.4 10.88-35.63 7.26-9.23 16.48-13.98 27.67-14.25 4.9.12 10.39 1.48 16.46 4.08 6.07 2.6 9.87 3.96 11.4 4.08 1.96-.24 5.99-1.64 12.1-4.2 6.1-2.56 11.46-3.79 16.08-3.69 11.43.5 20.73 4.41 27.91 11.73-10.03 6.07-14.93 14.56-14.7 25.48.24 9.07 3.73 16.63 10.48 22.68 6.75 6.05 14.78 9.54 24.1 10.46-2.07 6.19-4.53 12.28-7.39 18.28zM119.22 33.15c0-6.73 2.45-13.1 7.35-19.12 4.9-6.02 11.02-9.97 18.36-11.85.24 1.34.37 2.62.37 3.84 0 6.61-2.6 13.04-7.8 19.3-5.2 6.26-11.4 10.09-18.6 11.48-.48-1.22-.68-2.43-.68-3.65z" />
                </svg>
                <span>Pay</span>
              </div>
              {/* Google Pay */}
              <div
                className="h-7 px-2 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center text-[11px] font-semibold text-slate-200 tracking-tight shadow-sm hover:border-slate-700 transition-colors"
                title="Google Pay"
              >
                <span className="font-bold text-white mr-0.5">G</span>Pay
              </div>
              {/* PayPal */}
              <div
                className="h-7 px-2.5 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center text-[11px] font-bold text-sky-400 italic tracking-tight shadow-sm hover:border-slate-700 transition-colors"
                title="PayPal"
              >
                PayPal
              </div>
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all duration-200 cursor-pointer group"
              aria-label="Scroll back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
