"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { routes } from "@/utils/routes";
import { useCartStore } from "@/store/cartStore";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { logoutAndUpdateCookiesCart } from "@/server-actions/cart.action";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, refreshUser } = useAuth();
  const { items, setCart } = useCartStore();
  const tatalCartItems = items?.reduce((acc, curr) => {
    return acc + curr.qty;
  }, 0);

  // handle logout
  const handleLogout = async () => {
    try {
      await logoutAndUpdateCookiesCart();
      refreshUser();
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data?.items);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) return null;

  return (
    <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={routes.HOME} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-violet-600 text-white font-bold rounded-xl flex items-center justify-center shadow-xs">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white hidden sm:inline group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors tracking-tight">
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={routes.HOME}
              className="text-sm font-semibold text-slate-700 hover:text-violet-600 dark:text-slate-200 dark:hover:text-violet-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href={routes.PRODUCTS}
              className="text-sm font-semibold text-slate-700 hover:text-violet-600 dark:text-slate-200 dark:hover:text-violet-400 transition-colors"
            >
              Products
            </Link>
            <Link
              href={routes.ORDER}
              className="text-sm font-semibold text-slate-700 hover:text-violet-600 dark:text-slate-200 dark:hover:text-violet-400 transition-colors"
            >
              Orders
            </Link>
          </div>

          {/* Right side icons and buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Desktop) */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Cart */}
            <Link href={routes.CART} className="flex">
              <button
                type="button"
                aria-label="Shopping Cart"
                className="relative p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
              >
                <ShoppingCart
                  size={22}
                  className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                />
                {tatalCartItems > 0 && (
                  <span className="absolute top-1 right-1 min-w-4.5 h-4.5 px-1 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {tatalCartItems}
                  </span>
                )}
              </button>
            </Link>

            {/* Auth buttons - Desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-2.5">
                <Link
                  href={routes.PROFILE}
                  className="flex gap-x-2 items-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl py-1.5 px-3 cursor-pointer text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.firstName}</span>
                  <User
                    size={16}
                    className="text-slate-500 dark:text-slate-400"
                  />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors font-semibold text-xs border border-transparent dark:border-slate-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={routes.LOGIN}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={routes.REGISTER}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-2 bg-white dark:bg-slate-950 animate-in slide-in-from-top-2 duration-150">
            <Link
              href={routes.HOME}
              className="block px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:text-violet-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-violet-400 dark:hover:bg-slate-900 transition-colors text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href={routes.PRODUCTS}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:text-violet-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-violet-400 dark:hover:bg-slate-900 transition-colors text-sm"
            >
              Products
            </Link>
            <Link
              href={routes.ORDER}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:text-violet-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-violet-400 dark:hover:bg-slate-900 transition-colors text-sm"
            >
              Orders
            </Link>

            {user ? (
              <>
                <Link
                  href={routes.PROFILE}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-sm"
                >
                  <span>Profile</span>
                  <span className="uppercase text-violet-600 dark:text-violet-400 font-bold text-sm">
                    {user?.firstName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-rose-600 dark:text-rose-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 px-2">
                <Link
                  href={routes.LOGIN}
                  className="block text-center px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl font-semibold transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href={routes.REGISTER}
                  className="block text-center px-4 py-2.5 bg-violet-600 text-white hover:bg-violet-700 rounded-xl font-semibold transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Theme Toggle */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 px-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Appearance
              </span>
              <ThemeToggle variant="segmented" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
