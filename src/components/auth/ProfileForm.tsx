"use client";

import { useAuth } from "@/context/auth-context";
import { profileUpdateAction } from "@/server-actions/auth.actions";
import { routes } from "@/utils/routes";
import Link from "next/link";
import { useActionState, useEffect } from "react";

const initialState = {
  success: false,
  formErrors: {},
};

export default function ProfileForm() {
  const { user, refreshUser } = useAuth();

  const [state, formAction, isPending] = useActionState(
    profileUpdateAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      refreshUser();
      console.log("use effect called");
    }
  }, [state.updatedAt]);

  return (
    <div className="mx-auto max-w-4xl">
      <form action={formAction} className="space-y-6">
        <div className="bg-gray-50 border border-slate-300 shadow-2xl rounded-lg p-6 space-y-5">
          <h2 className="text-xl font-bold text-foreground">Your Profile</h2>

          {/* FIRST + LAST NAME */}
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <input
                name="firstName"
                defaultValue={user?.firstName}
                className={`w-full px-4 py-2 border rounded-lg ${
                  state.formErrors?.firstName
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />
              {state.formErrors?.firstName && (
                <p className="text-xs text-red-500 mt-1">
                  {state.formErrors.firstName}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <input
                name="lastName"
                defaultValue={user?.lastName}
                className={`w-full px-4 py-2 border rounded-lg ${
                  state.formErrors?.lastName
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />
              {state.formErrors?.lastName && (
                <p className="text-xs text-red-500 mt-1">
                  {state.formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* EMAIL + PHONE */}
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                defaultValue={user?.email}
                readOnly
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-gray-100"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                name="phone"
                defaultValue={user?.phone}
                className={`w-full px-4 py-2 border rounded-lg ${
                  state.formErrors?.phone
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />
              {state.formErrors?.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {state.formErrors.phone}
                </p>
              )}
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-medium mb-1">Address *</label>
            <input
              name="home"
              defaultValue={user?.address.home}
              className={`w-full px-4 py-2 border rounded-lg ${
                state.formErrors?.address
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />
            {state.formErrors?.address && (
              <p className="text-xs text-red-500 mt-1">
                {state.formErrors.address}
              </p>
            )}
          </div>

          {/* CITY STATE PINCODE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                name="city"
                defaultValue={user?.address.city}
                className={`w-full px-4 py-2 border rounded-lg ${
                  state.formErrors?.city ? "border-red-500" : "border-slate-300"
                }`}
              />
              {state.formErrors?.city && (
                <p className="text-xs text-red-500 mt-1">
                  {state.formErrors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                name="state"
                defaultValue={user?.address.state}
                className={`w-full px-4 py-2 border rounded-lg ${
                  state.formErrors?.state
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />
              {state.formErrors?.state && (
                <p className="text-xs text-red-500 mt-1">
                  {state.formErrors.state}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Pincode *
              </label>
              <input
                name="pincode"
                defaultValue={user?.address.pincode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  state.formErrors?.pincode
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />
              {state.formErrors?.pincode && (
                <p className="text-xs text-red-500 mt-1">
                  {state.formErrors.pincode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center">
          <Link
            href={routes.CART}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            ← Back to Cart
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Update Profile"}
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        {state.success && (
          <p className="text-green-600 font-medium">
            ✅ Profile updated successfully
          </p>
        )}
      </form>
    </div>
  );
}
