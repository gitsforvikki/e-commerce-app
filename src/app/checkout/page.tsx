import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { OrderSummery } from "@/components/order/OrderSummery";
import { DisplayUser } from "@/components/profile/DisplayUser";
import { CashfreeCheckoutButton } from "@/components/payment/CashfreeCheckoutButton";
import { routes } from "@/utils/routes";
import {
  Edit2,
  Home,
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { getLoggedInUser } from "@/lib/auth";
import { getCartItemsFromDB } from "@/services/cart/get-cart-fromdb.service";
import { CartItemUiType } from "@/type";
import { formatInr } from "@/services/order/pricing.service";

export const metadata: Metadata = {
  title: "Secure Checkout | ShopHub",
  description: "Complete your purchase securely on ShopHub with encrypted payments and express delivery.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const userInfo = await getLoggedInUser();
  const items: CartItemUiType[] = await getCartItemsFromDB(userInfo?.userId);

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-slate-50/60 dark:bg-slate-950 py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Link
            href={routes.HOME}
            className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <Link
            href={routes.CART}
            className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Shopping Cart
          </Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Checkout
          </span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2 border border-emerald-200/60 dark:border-emerald-800/40">
              <Lock size={12} />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Order Checkout
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Please verify your delivery address and payment details below
            </p>
          </div>

          <Link
            href={routes.CART}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Review Cart Items</span>
          </Link>
        </div>

        {/* 2-Column Responsive Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Shipping, Delivery & Payment (8 cols)        */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Customer & Shipping Address Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-2xs">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Delivery & Contact Information
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your items will be dispatched to this verified address
                    </p>
                  </div>
                </div>

                <Link
                  href={routes.PROFILE}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <Edit2 size={13} />
                  <span>Edit in Profile</span>
                </Link>
              </div>

              <DisplayUser />
            </div>

            {/* 2. Delivery Options Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
                  <Truck size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Delivery Method
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Insured priority courier with real-time GPS tracking
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-white">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      ShopHub Priority Express
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Estimated Delivery: 2-3 business days
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                  Included
                </span>
              </div>
            </div>

            {/* 3. Payment Method Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Payment Gateway
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Encrypted multi-option payments powered by Cashfree (Sandbox Test Mode)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-white">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        Cashfree Sandbox Gateway
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Test UPI, Cards, Net Banking & Wallets (No Real Money Charged)
                      </span>
                    </div>
                  </div>
                  <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-wrap gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Cashfree Sandbox</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Test UPI</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Test Cards</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Net Banking</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Zero Real Charges</span>
                </div>
              </div>
            </div>

            {/* 4. Order Items Preview */}
            {items && items.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Items in this Order ({items.reduce((acc, curr) => acc + curr.qty, 0)})
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Products reserved for instant dispatch
                      </p>
                    </div>
                  </div>

                  <Link
                    href={routes.CART}
                    className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Modify Cart
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {items.map((item) => (
                    <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Qty: <strong className="text-slate-700 dark:text-slate-200">{item.qty}</strong> × {formatInr(item.price * 100)}
                          </p>
                        </div>
                      </div>

                      <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white shrink-0">
                        {formatInr(item.price * item.qty * 100)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Order Summary & Place Order CTA (4 cols)    */}
          {/* ======================================================== */}
          <div className="lg:col-span-4">
            <OrderSummery>
              <CashfreeCheckoutButton />
            </OrderSummery>
          </div>
        </div>
      </div>
    </div>
  );
}
