"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Sparkles,
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import { routes } from "@/utils/routes";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
                Be the first to hear about curated product drops, secret flash sales, and exclusive weekly editorial picks.
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
                      className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center gap-1 text-xs font-medium"
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
                      🔒 No spam, ever. Unsubscribe with a single click at any time.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= TRUST & VALUE PROPOSITIONS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-violet-500/30 hover:bg-slate-900/70 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-violet-500/20 transition-all duration-200">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Free standard delivery on all qualifying orders over $50.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-violet-500/30 hover:bg-slate-900/70 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-violet-500/20 transition-all duration-200">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hassle-free return policy with prepaid shipping labels.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-violet-500/30 hover:bg-slate-900/70 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-violet-500/20 transition-all duration-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Bank-level 256-bit SSL encryption & buyer protection.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-violet-500/30 hover:bg-slate-900/70 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-violet-500/20 transition-all duration-200">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Concierge Support</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dedicated support team ready to assist around the clock.
              </p>
            </div>
          </div>
        </div>

        {/* ================= MAIN NAVIGATION LINKS & BRAND ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-10 pt-4">
          {/* Brand Info (Spans 2 columns on lg screens) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link href={routes.HOME} className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-extrabold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Shop<span className="text-violet-400">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your modern destination for premium curated electronics, designer fashion, and lifestyle essentials. Designed for elegance, built for daily performance.
            </p>

            {/* Direct Contact Points */}
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5 hover:text-slate-200 transition-colors">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <a href="mailto:support@shophub.com">support@shophub.com</a>
              </div>
              <div className="flex items-center gap-2.5 hover:text-slate-200 transition-colors">
                <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                <a href="tel:+18005550199">+1 (800) 555-0199 (Mon–Fri, 9am–6pm)</a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                <span>San Francisco, California, USA</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Connect with us
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ShopHub on Twitter"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ShopHub on Instagram"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ShopHub on Facebook"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ShopHub on YouTube"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ShopHub on GitHub"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ShopHub on LinkedIn"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Shop & Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href={routes.PRODUCTS}
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href={routes.PRODUCTS}
                  className="hover:text-violet-400 transition-colors inline-flex items-center gap-2"
                >
                  <span>New Arrivals</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href={routes.PRODUCTS}
                  className="hover:text-violet-400 transition-colors inline-flex items-center gap-2"
                >
                  <span>Trending Deals</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Hot
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href={routes.PRODUCTS}
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Electronics & Tech
                </Link>
              </li>
              <li>
                <Link
                  href={routes.PRODUCTS}
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Fashion & Lifestyle
                </Link>
              </li>
              <li>
                <Link
                  href={routes.PRODUCTS}
                  className="hover:text-violet-400 transition-colors inline-flex items-center gap-2"
                >
                  <span>Clearance Sale</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    -40%
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href={routes.ORDER}
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Help Center & FAQs
                </a>
              </li>
              <li>
                <a
                  href="#shipping"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a
                  href="#returns"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <Link
                  href={routes.CART}
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@shophub.com"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href={routes.ABOUT || "#about"}
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  About ShopHub
                </Link>
              </li>
              <li>
                <a
                  href="#careers"
                  className="hover:text-violet-400 transition-colors inline-flex items-center gap-2"
                >
                  <span>Careers</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Hiring
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#sustainability"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Sustainability
                </a>
              </li>
              <li>
                <a
                  href="#press"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Press & Media
                </a>
              </li>
              <li>
                <a
                  href="#affiliates"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Affiliate Program
                </a>
              </li>
              <li>
                <a
                  href="#stores"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Store Locator
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="#privacy"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#cookie"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Cookie Settings
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Security & Compliance
                </a>
              </li>
              <li>
                <a
                  href="#accessibility"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Accessibility
                </a>
              </li>
              <li>
                <a
                  href="#licenses"
                  className="hover:text-violet-400 transition-colors inline-block"
                >
                  Merchant Licensing
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ================= BOTTOM BAR & PAYMENT BADGES ================= */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright & Live Status */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} ShopHub Inc. All rights reserved.</p>
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
            <div className="flex items-center gap-1.5" aria-label="Accepted Payment Methods">
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
                <svg className="w-3 h-3 fill-current mr-0.5" viewBox="0 0 170 170">
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
