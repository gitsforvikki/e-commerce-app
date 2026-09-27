"use client";

import { useState } from "react";
import {
  Bell,
  PackageCheck,
  BadgePercent,
  ShieldAlert,
  Sparkles,
  Check,
} from "lucide-react";

type PreferenceItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  defaultState: boolean;
};

const PREFERENCES_DATA: PreferenceItem[] = [
  {
    id: "orders",
    title: "Order & Shipping Notifications",
    description: "Get real-time tracking alerts via SMS and email when your parcel is shipped or out for delivery.",
    icon: PackageCheck,
    iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60",
    defaultState: true,
  },
  {
    id: "promos",
    title: "Promotional Offers & Flash Sales",
    description: "Receive notifications about seasonal promotions, exclusive member discounts, and coupon drops.",
    icon: BadgePercent,
    iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60",
    defaultState: false,
  },
  {
    id: "security",
    title: "Security & Login Alerts",
    description: "Receive instant notifications when an unfamiliar device logs into your account or changes are made.",
    icon: ShieldAlert,
    iconColor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60",
    defaultState: true,
  },
  {
    id: "recommendations",
    title: "Personalized Recommendations",
    description: "Tailor product highlights and personalized suggestions based on your browsing and purchase history.",
    icon: Sparkles,
    iconColor: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60",
    defaultState: true,
  },
];

export const Preference = () => {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    PREFERENCES_DATA.forEach((item) => {
      initial[item.id] = item.defaultState;
    });
    return initial;
  });

  const [lastToggled, setLastToggled] = useState<string | null>(null);

  const toggle = (id: string) => {
    setPrefs((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      setLastToggled(id);
      return next;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Bell size={18} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Communication & App Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize what updates and messages you receive from ShopHub.
            </p>
          </div>
        </div>

        {lastToggled && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-900/40 animate-in fade-in">
            <Check size={12} />
            <span>Preferences saved</span>
          </span>
        )}
      </div>

      {/* Preferences List */}
      <div className="space-y-3.5">
        {PREFERENCES_DATA.map((item) => {
          const Icon = item.icon;
          const isEnabled = Boolean(prefs[item.id]);

          return (
            <div
              key={item.id}
              className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Custom Switch Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                onClick={() => toggle(item.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
                  isEnabled
                    ? "bg-violet-600 dark:bg-violet-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
