"use client";

import { useTheme } from "@/context/theme-context";
import { Sun, Moon, Laptop } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ThemeToggleProps {
  variant?: "icon" | "segmented" | "dropdown";
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle = ({
  variant = "icon",
  showLabel = false,
  className = "",
}: ThemeToggleProps) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside if dropdown variant is used
  useEffect(() => {
    if (variant !== "dropdown") return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant]);

  // Prevent layout shift / hydration mismatch before mounting
  if (!mounted) {
    if (variant === "segmented") {
      return (
        <div className={`flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 w-36 h-9 ${className}`} />
      );
    }
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 ${className}`}
        aria-hidden="true"
      />
    );
  }

  // 1. SEGMENTED VARIANT (Ideal for mobile menu & drawers)
  if (variant === "segmented") {
    return (
      <div
        className={`flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 ${className}`}
        role="group"
        aria-label="Theme selector"
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            resolvedTheme === "light"
              ? "bg-white text-slate-900 shadow-xs font-bold"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
          aria-pressed={resolvedTheme === "light"}
        >
          <Sun size={14} className={resolvedTheme === "light" ? "text-amber-500" : ""} />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            resolvedTheme === "dark"
              ? "bg-slate-900 text-white shadow-xs font-bold"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
          aria-pressed={resolvedTheme === "dark"}
        >
          <Moon size={14} className={resolvedTheme === "dark" ? "text-violet-400" : ""} />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // 2. DROPDOWN VARIANT (Optional full 3-choice menu)
  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-label="Select theme"
          className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs transition-colors"
        >
          {resolvedTheme === "dark" ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-violet-600" />
          )}
          {showLabel && (
            <span className="text-xs font-semibold capitalize">{theme}</span>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 text-xs font-semibold animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setTheme("light");
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left ${
                theme === "light"
                  ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Sun size={15} className="text-amber-500" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("dark");
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left ${
                theme === "dark"
                  ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Moon size={15} className="text-violet-400" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("system");
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left ${
                theme === "system"
                  ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Laptop size={15} className="text-slate-400" />
              <span>System</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. ICON TOGGLE (DEFAULT FOR NAVBAR) - Single-click seamless toggle with smooth rotation animation
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-95 group cursor-pointer ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon (Visible when in Dark mode, clicking switches to Light mode) */}
        <Sun
          size={18}
          className={`absolute text-amber-400 transition-all duration-300 transform ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0 pointer-events-none"
          }`}
        />

        {/* Moon Icon (Visible when in Light mode, clicking switches to Dark mode) */}
        <Moon
          size={18}
          className={`absolute text-slate-700 group-hover:text-violet-600 transition-all duration-300 transform ${
            !isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0 pointer-events-none"
          }`}
        />
      </div>
    </button>
  );
};
