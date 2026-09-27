"use client";

import { useAuth } from "@/context/auth-context";
import { profileUpdateAction } from "@/server-actions/auth.actions";
import {
  Edit2,
  Check,
  X,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { DisplayUser } from "./DisplayUser";

const initialState = {
  success: false,
  formErrors: {} as Record<string, string | undefined>,
};

export const ProfileMainPAge = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, refreshUser } = useAuth();
  const [state, formAction, isPending] = useActionState(
    profileUpdateAction,
    initialState,
  );

  useEffect(() => {
    if (!state.success) return;

    const timer = window.setTimeout(() => {
      void refreshUser();
      setIsEditing(false);
      setShowSuccess(true);
    }, 0);

    const hideTimer = window.setTimeout(() => {
      setShowSuccess(false);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hideTimer);
    };
  }, [refreshUser, state.success]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Personal & Shipping Information
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-11">
            Review and update your contact details and default delivery destination.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/50 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-bold text-xs transition-colors cursor-pointer border border-violet-200/60 dark:border-violet-800/50 self-start sm:self-auto"
          >
            <Edit2 size={14} />
            <span>Edit Information</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Profile information updated successfully!</span>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="text-emerald-600 dark:text-emerald-400 hover:opacity-80 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {isEditing ? (
        <div>
          <form action={formAction} className="space-y-6">
            <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
              {/* FIRST + LAST NAME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    defaultValue={user?.firstName}
                    placeholder="e.g. John"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                      state.formErrors?.firstName
                        ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }`}
                  />
                  {state.formErrors?.firstName && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{state.formErrors.firstName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    defaultValue={user?.lastName}
                    placeholder="e.g. Doe"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                      state.formErrors?.lastName
                        ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }`}
                  />
                  {state.formErrors?.lastName && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{state.formErrors.lastName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* EMAIL + PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Email Address
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Primary (Read-only)
                    </span>
                  </div>
                  <input
                    name="email"
                    defaultValue={user?.email}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed text-sm font-medium outline-none"
                  />
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    Contact support if you need to update your registered email.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="phone"
                    defaultValue={user?.phone}
                    placeholder="e.g. 9876543210"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                      state.formErrors?.phone
                        ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }`}
                  />
                  {state.formErrors?.phone && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{state.formErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* STREET ADDRESS */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Street Address / House / Apartment <span className="text-rose-500">*</span>
                </label>
                <input
                  name="home"
                  defaultValue={user?.address?.home ?? ""}
                  placeholder="e.g. Flat 402, Sunshine Heights, Main Street"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                    state.formErrors?.address
                      ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }`}
                />
                {state.formErrors?.address && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{state.formErrors.address}</span>
                  </p>
                )}
              </div>

              {/* CITY STATE PINCODE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="city"
                    defaultValue={user?.address?.city ?? ""}
                    placeholder="e.g. Mumbai"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                      state.formErrors?.city
                        ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }`}
                  />
                  {state.formErrors?.city && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{state.formErrors.city}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="state"
                    defaultValue={user?.address?.state ?? ""}
                    placeholder="e.g. Maharashtra"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                      state.formErrors?.state
                        ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }`}
                  />
                  {state.formErrors?.state && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{state.formErrors.state}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="pincode"
                    defaultValue={user?.address?.pincode ?? ""}
                    placeholder="e.g. 400001"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                      state.formErrors?.pincode
                        ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }`}
                  />
                  {state.formErrors?.pincode && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{state.formErrors.pincode}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:flex-1 py-3 px-6 bg-violet-600 hover:bg-violet-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Changes…</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Save Information</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <DisplayUser />
      )}
    </div>
  );
};
