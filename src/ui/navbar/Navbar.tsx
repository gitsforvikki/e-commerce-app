"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import "./style.css";
import { routes } from "@/utils/routes";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, refreshUser } = useAuth();

  //handle logout
  const handleLogout = () => {
    try {
      fetch("/api/logout", {
        method: "POST",
      }).then((res) => {
        if (res.ok) {
          refreshUser();
        }
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  if (loading) return null;
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={routes.HOME} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-violet-600 text-white font-bold rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline group-hover:text-primary transition-colors">
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href={routes.HOME} className="navbar-links">
              Home
            </Link>
            <Link href={routes.PRODUCTS} className="navbar-links">
              Products
            </Link>
            <Link href={routes.ABOUT} className="navbar-links">
              About
            </Link>
            <Link href={routes.CONTACT} className="navbar-links">
              Contact
            </Link>
          </div>

          {/* Right side icons and buttons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="hidden lg:flex items-center gap-2 bg-muted rounded-full px-4 py-2 hover:bg-accent/10 transition-colors">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-32 placeholder-muted-foreground"
              />
            </button>

            {/* Cart */}
            <Link href={routes.CART}>
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors group">
                <ShoppingCart
                  size={25}
                  className="text-foreground group-hover:text-primary transition-colors"
                />
                <span className="absolute top-1 right-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </Link>

            {/* Auth buttons - Desktop */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-foreground">{user?.firstName} </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={routes.LOGIN}
                  className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href={routes.REGISTER}
                  className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link
              href={routes.HOME}
              className="navbar-links-mobile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link href={routes.PRODUCTS} className="navbar-links-mobile">
              Products
            </Link>
            <Link href={routes.ABOUT} className="navbar-links-mobile">
              About
            </Link>
            <Link href={routes.CART} className="navbar-links-mobile">
              Cart
            </Link>
            <div className="border-t border-border pt-3 space-y-2">
              <Link
                href={routes.LOGIN}
                className="navbar-links-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href={routes.REGISTER}
                className="navbar-links-mobile bg-violet-500 text-white hover:bg-violet-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
