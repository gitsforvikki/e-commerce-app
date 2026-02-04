"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { register } from "@/server-actions/auth.actions";
import "./style.css";
const initialState = {
  success: false,
  formErrors: {},
};

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [state, formAction] = useActionState(register, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center bg-white rounded-2xl shadow-2xl  px-4 md:px-6 lg:px-10 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join us and start shopping today
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-foreground"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  className={`register-form-input ${
                    state.formErrors?.firstName
                      ? "border-red-500"
                      : "border-slate-400"
                  }`}
                />
                {state.formErrors?.firstName && (
                  <p className="text-xs text-destructive">
                    {state.formErrors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-foreground"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  className={`register-form-input ${
                    state.formErrors?.lastName
                      ? "border-red-500"
                      : "border-slate-400"
                  }`}
                />
                {state.formErrors?.lastName && (
                  <p className="text-xs text-destructive">
                    {state.formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={`register-form-input ${
                  state.formErrors?.email
                    ? "border-red-500"
                    : "border-slate-400"
                }`}
              />
              {state.formErrors?.email && (
                <p className="text-xs text-destructive">
                  {state.formErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`register-form-input ${
                    state.formErrors?.password
                      ? "border-red-500"
                      : "border-slate-400"
                  }`}
                />
                {state.formErrors?.password && (
                  <p className="text-xs text-destructive mt-1">
                    {state.formErrors.password}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`register-form-input ${
                    errors.confirmPassword
                      ? "border-destructive"
                      : "border-slate-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className={`w-4 h-4 mt-1 rounded border cursor-pointer accent-primary shrink-0 ${
                    errors.agreeTerms
                      ? "border-destructive"
                      : "border-slate-400"
                  }`}
                />
                <span className="text-sm text-foreground group-hover:text-indigo-500 transition-colors">
                  I agree to the{" "}
                  <a href="#" className="underline font-semibold">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline font-semibold">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-destructive">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-500 text-white py-3 rounded-lg font-semibold hover:bg-violet-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-500 hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
