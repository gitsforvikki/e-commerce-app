"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { routes } from "@/utils/routes";

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email Us Directly",
    detail: "support@shophub.com",
    subtext: "Expect replies within 2–4 hours",
    action: "mailto:support@shophub.com",
    actionText: "Send an Email",
  },
  {
    icon: Phone,
    title: "Phone & WhatsApp Support",
    detail: "+91 (800) 123-4567",
    subtext: "Mon – Sat: 9:00 AM – 8:00 PM IST",
    action: "tel:+918001234567",
    actionText: "Call Concierge",
  },
  {
    icon: MapPin,
    title: "Corporate Headquarters",
    detail: "ShopHub Commerce India Pvt Ltd",
    subtext: "100 Feet Rd, Indiranagar, Bengaluru, KA 560038",
    action: "https://maps.google.com/?q=Indiranagar+Bengaluru",
    actionText: "View on Map",
  },
  {
    icon: Clock,
    title: "Operating Hours",
    detail: "Fulfillment & Dispatch: 24/7",
    subtext: "Support Desk: 9:00 AM – 8:00 PM IST (Mon–Sat)",
    action: null,
    actionText: null,
  },
];

const FAQS = [
  {
    question: "How do I track my active order?",
    answer:
      "You can view real-time tracking anytime by visiting the Orders section under your profile or clicking 'Orders' in the main navigation. You will also receive SMS and email status updates.",
  },
  {
    question: "What is your return & exchange window?",
    answer:
      "We offer a 7-day hassle-free return and replacement policy for all eligible items. Items must be unused, with original tags intact and authentic packaging.",
  },
  {
    question: "Which payment options do you support?",
    answer:
      "We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Wallet via Cashfree and Razorpay.",
  },
  {
    question: "How long does standard delivery take?",
    answer:
      "Metro cities typically receive deliveries within 24 to 48 hours. For rest of India, standard dispatch takes 3 to 5 business days with priority courier partners.",
  },
];

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "General Inquiry",
    orderId: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTicket, setSuccessTicket] = useState<{
    ticketId: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setSuccessTicket({
        ticketId: data.ticketId,
        message: data.message,
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "General Inquiry",
        orderId: "",
        message: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyTicketId = () => {
    if (successTicket?.ticketId) {
      navigator.clipboard.writeText(successTicket.ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* ================= HEADER ================= */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <MessageSquare size={14} />
          Customer Care Concierge
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          We&apos;re Here to Help
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Have an order inquiry, feedback, or partnership proposal? Reach out and our dedicated support team will respond promptly.
        </p>
      </div>

      {/* ================= MAIN 2-COLUMN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Contact Cards + FAQs (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Contact Details List */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Direct Channels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {CONTACT_INFO.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-violet-300 dark:hover:border-violet-700/50 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mt-0.5">
                          {item.detail}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.subtext}
                        </p>
                      </div>
                    </div>

                    {item.action && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <a
                          href={item.action}
                          target={item.action.startsWith("http") ? "_blank" : undefined}
                          rel={item.action.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                        >
                          {item.actionText} &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-violet-600 dark:text-violet-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-4 py-3 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 hover:text-violet-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-violet-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Send Us a Message
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
              Fill out the form below. For order-related inquiries, include your Order ID for faster resolution.
            </p>

            {/* Success state */}
            {successTicket ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-900 dark:text-slate-100 space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Inquiry Submitted Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {successTicket.message}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-500/20">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                      Your Reference Ticket ID
                    </span>
                    <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">
                      {successTicket.ticketId}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyTicketId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSuccessTicket(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
                  >
                    Send Another Message
                  </button>
                  <Link
                    href={routes.PRODUCTS}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                  >
                    Back to Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-category"
                      className="text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Inquiry Subject / Topic
                    </label>
                    <select
                      id="contact-category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Tracking & Shipping">
                        Order Tracking & Shipping
                      </option>
                      <option value="Returns & Exchanges">
                        Returns & Exchanges
                      </option>
                      <option value="Payment / Billing Issue">
                        Payment / Billing Issue
                      </option>
                      <option value="Product Authenticity / Warranty">
                        Product Authenticity / Warranty
                      </option>
                      <option value="Partnership & Wholesale">
                        Partnership & Wholesale
                      </option>
                    </select>
                  </div>

                  {/* Order ID (Optional) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-order-id"
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between"
                    >
                      <span>Order ID</span>
                      <span className="text-slate-400 font-normal">Optional</span>
                    </label>
                    <input
                      id="contact-order-id"
                      type="text"
                      placeholder="e.g. ORD-171829"
                      value={formData.orderId}
                      onChange={(e) =>
                        setFormData({ ...formData, orderId: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Subject Line */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="Brief description of your question or issue"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Tell us in detail what you need assistance with..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-sm transition-all resize-y min-h-[120px]"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-bold text-sm shadow-md hover:shadow-violet-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  By submitting, you agree to our privacy policy. We will never share your personal information.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
