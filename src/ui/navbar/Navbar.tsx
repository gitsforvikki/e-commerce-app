"use client";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import "./style.css";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-href-br from-primary href-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline group-hover:text-primary transition-colors">
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="navbar-links">
              Home
            </Link>
            <Link href="#products" className="navbar-links">
              Products
            </Link>
            <Link href="#about" className="navbar-links">
              About
            </Link>
            <Link href="#contact" className="navbar-links">
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
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors group">
              <ShoppingCart
                size={20}
                className="text-foreground group-hover:text-primary transition-colors"
              />
              <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Auth buttons - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-indigo-500 text-primary-foreground rounded-lg hover:bg-indigo-600 transition-colors font-medium"
              >
                Register
              </Link>
            </div>

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
              href="/"
              className="navbar-links-mobile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link href="#products" className="navbar-links-mobile">
              Products
            </Link>
            <Link href="#about" className="navbar-links-mobile">
              About
            </Link>
            <Link href="#contact" className="navbar-links-mobile">
              Contact
            </Link>
            <div className="border-t border-border pt-3 space-y-2">
              <Link
                href="/login"
                className="navbar-links-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="navbar-links-mobile bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
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
