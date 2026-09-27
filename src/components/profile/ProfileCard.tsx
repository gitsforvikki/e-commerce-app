"use client";

import { useAuth } from "@/context/auth-context";
import {
  Heart,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  User,
  ShieldCheck,
  MapPin,
  Loader2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/utils/routes";
import { useCartStore } from "@/store/cartStore";
import { logoutAndUpdateCookiesCart } from "@/server-actions/cart.action";

export const ProfileCard = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { items, setCart } = useCartStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const userName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const safeUserName = userName || "Valued Shopper";
  const initials = safeUserName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const totalCartCount = items?.reduce((acc, curr) => acc + curr.qty, 0) || 0;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutAndUpdateCookiesCart();
      refreshUser();
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data?.items || []);
      router.push(routes.LOGIN);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl p-6 sm:p-7 sticky top-24 space-y-6 transition-colors">
      {/* Avatar & User Details */}
      <div className="flex flex-col items-center text-center space-y-3.5">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-violet-600/25 ring-4 ring-violet-500/20">
            {initials}
          </div>
          <div
            title="Verified Shopper"
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-sm"
          >
            <ShieldCheck size={18} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {safeUserName}
            </h2>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
            {user?.email || "guest@shophub.com"}
          </p>
          <div className="pt-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40 rounded-full px-3 py-0.5 w-fit mx-auto">
            <Calendar size={12} />
            <span>Member since {user?.memberSince || "2024"}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
        <Link
          href={routes.ORDER}
          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700/60 transition-colors group"
        >
          <div className="text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">
            <ShoppingBag size={18} />
          </div>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            Orders
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            History
          </span>
        </Link>

        <Link
          href={routes.CART}
          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700/60 transition-colors group"
        >
          <div className="text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">
            <ShoppingCart size={18} />
          </div>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {totalCartCount}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            In Cart
          </span>
        </Link>

        <div className="flex flex-col items-center justify-center p-2 rounded-xl">
          <div className="text-slate-500 dark:text-slate-400 mb-1">
            <MapPin size={18} />
          </div>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {user?.address?.city ? "1 Saved" : "0 Saved"}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            Address
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <Link
          href={routes.ORDER}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 active:scale-98 text-white rounded-2xl font-bold shadow-md shadow-violet-600/20 transition-all hover:scale-101 cursor-pointer text-sm"
        >
          <ShoppingBag size={18} />
          <span>View All Orders</span>
        </Link>

        <Link
          href={routes.PRODUCTS}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 active:scale-98 text-slate-800 dark:text-slate-200 rounded-2xl font-bold transition-all text-sm cursor-pointer"
        >
          <ExternalLink size={16} />
          <span>Browse Products</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl font-bold transition-all text-sm cursor-pointer disabled:opacity-60"
        >
          {loggingOut ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Signing Out…</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span>Sign Out</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
