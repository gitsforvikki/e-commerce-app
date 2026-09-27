"use client";

import { useAuth } from "@/context/auth-context";
import { Mail, MapPin, Phone, User, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { routes } from "@/utils/routes";

export const DisplayUser = () => {
  const { user } = useAuth();

  const hasFullAddress =
    user?.address?.home &&
    user?.address?.city &&
    user?.address?.state &&
    user?.address?.pincode &&
    user?.phone;

  const formattedAddress = [
    user?.address?.home,
    user?.address?.city,
    user?.address?.state ? `${user.address.state} - ${user.address.pincode || ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-4">
      {/* Name Tile */}
      <div className="flex items-center gap-3.5 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl transition-colors">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
          <User size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Full Name
          </p>
          <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
          </p>
        </div>
      </div>

      {/* Email Tile */}
      <div className="flex items-center gap-3.5 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl transition-colors">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Mail size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Email Address
          </p>
          <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">
            {user?.email || "No email on record"}
          </p>
        </div>
      </div>

      {/* Phone Tile */}
      <div className="flex items-center gap-3.5 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl transition-colors">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Phone size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Contact Number
          </p>
          <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            {user?.phone ? `+91 ${user.phone}` : "No phone number added"}
          </p>
        </div>
      </div>

      {/* Address Tile */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl transition-colors space-y-2">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <MapPin size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Delivery Address
              </p>
              {hasFullAddress ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={12} />
                  <span>Ready to ship</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <AlertCircle size={12} />
                  <span>Incomplete</span>
                </span>
              )}
            </div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 leading-snug">
              {formattedAddress || "No address added yet"}
            </p>
          </div>
        </div>

        {!hasFullAddress && (
          <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Complete address required to process checkout.
            </p>
            <Link
              href={routes.PROFILE}
              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Add in Profile →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
