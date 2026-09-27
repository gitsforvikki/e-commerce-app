"use client";

import { useTheme } from "@/context/theme-context";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const ThemeToggle = ({
  showLabel = false,
  variant = "dropdown",
}: {
  showLabel?: boolean;
  variant?: "dropdown" | "simple";
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (variant === "simple") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full font-semibold text-sm"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Sun
            size={18}
            className={`transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "scale-0 opacity-0 rotate-90"
                : "scale-100 opacity-100 rotate-0 text-amber-500"
            }`}
          />
          <Moon
            size={18}
            className={`absolute transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "scale-100 opacity-100 rotate-0 text-violet-400"
                : "scale-0 opacity-0 -rotate-90"
            }`}
          />
        </div>
        {showLabel && (
          <span>
            {resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-label="Select theme"
        className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs transition-colors"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Sun
            size={18}
            className={`transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "scale-0 opacity-0 rotate-90"
                : "scale-100 opacity-100 rotate-0 text-amber-500"
            }`}
          />
          <Moon
            size={18}
            className={`absolute transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "scale-100 opacity-100 rotate-0 text-violet-400"
                : "scale-0 opacity-0 -rotate-90"
            }`}
          />
        </div>
        <ChevronDown size={13} className="text-slate-400 dark:text-slate-400" />
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
};
