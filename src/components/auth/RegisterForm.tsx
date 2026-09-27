"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { register } from "@/server-actions/auth.actions";
import { routes } from "@/utils/routes";

const initialState = {
  success: false,
  formErrors: {},
  error: "",
};

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [clientError, setClientError] = useState("");

  const [state, formAction, pending] = useActionState(register, initialState);

  const handleSubmit = (formData: FormData) => {
    setClientError("");
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setClientError("Passwords do not match. Please verify both fields.");
      return;
    }

    if (!agreeTerms) {
      setClientError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    formAction(formData);
  };

  const passwordsMatch =
    confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;
  const passwordsMismatch =
    confirmPasswordValue.length > 0 && passwordValue !== confirmPasswordValue;

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-violet-950/20 p-6 sm:p-10 transition-all relative z-10">
      {/* Brand Logo & Header */}
      <div className="text-center mb-8">
        <Link
          href={routes.HOME}
          className="inline-flex items-center gap-2 mb-4 group"
          title="Return to ShopHub Home"
        >
          <div className="w-9 h-9 bg-violet-600 text-white font-extrabold rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="text-lg">S</span>
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            ShopHub
          </span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create an Account
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Join ShopHub for verified deals, express delivery, and easy returns
        </p>
      </div>

      {/* Global / Server Error Banner */}
      {(state?.error || clientError) && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">
            {clientError || state.error}
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form action={handleSubmit} className="space-y-4">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <User size={16} />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="John"
                className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  state.formErrors?.firstName
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-300 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
                }`}
              />
            </div>
            {state.formErrors?.firstName && (
              <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1">
                {state.formErrors.firstName[0]}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <User size={16} />
              </div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Doe"
                className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  state.formErrors?.lastName
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-300 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
                }`}
              />
            </div>
            {state.formErrors?.lastName && (
              <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1">
                {state.formErrors.lastName[0]}
              </p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail size={16} />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
                state.formErrors?.email
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-300 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
              }`}
            />
          </div>
          {state.formErrors?.email && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1">
              {state.formErrors.email[0]}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock size={16} />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
                state.formErrors?.password
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-300 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {state.formErrors?.password ? (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1">
              {state.formErrors.password[0]}
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              At least 8 characters with uppercase, lowercase, numbers & symbols.
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock size={16} />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPasswordValue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
                passwordsMismatch
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : passwordsMatch
                  ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "border-slate-300 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1.5">
              {passwordsMatch && (
                <CheckCircle2 size={16} className="text-emerald-500" />
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {passwordsMismatch && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1">
              Passwords do not match.
            </p>
          )}
        </div>

        {/* Terms of Service Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-violet-600 focus:ring-violet-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 accent-violet-600 cursor-pointer shrink-0"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-violet-600 hover:bg-violet-700 active:scale-99 transition-all shadow-md shadow-violet-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {pending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Social Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
            Or sign up with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      {/* Switch to Login */}
      <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-8">
        Already have an account?{" "}
        <Link
          href={routes.LOGIN}
          className="text-violet-600 dark:text-violet-400 hover:underline font-bold"
        >
          Sign in
        </Link>
      </p>

      {/* Trust Guarantee Note */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>100% confidential registration & encrypted data protection</span>
      </div>
    </div>
  );
};
