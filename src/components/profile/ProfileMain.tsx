"use client";
import { useAuth } from "@/context/auth-context";
import { profileUpdateAction } from "@/server-actions/auth.actions";
import { Edit2, Mail, MapPin, Phone, User } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  success: false,
  formErrors: {},
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
    if (state.success) {
      refreshUser();
      setIsEditing(false);
      setShowSuccess(true);
      let timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [state.updatedAt]);
  return (
    <div className="bg-card border border-gray-300 shadow-xl rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">
          Account Information
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-600 font-bold/80 font-medium transition-colors"
          >
            <Edit2 size={18} />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <form action={formAction} className="space-y-6">
            <div className=" border border-slate-300 shadow-sm rounded-lg p-6 space-y-5">
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
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    defaultValue={user?.email}
                    readOnly
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-gray-100"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
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
                <label className="block text-sm font-medium mb-1">
                  Address *
                </label>
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
                  <label className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <input
                    name="city"
                    defaultValue={user?.address.city}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      state.formErrors?.city
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />
                  {state.formErrors?.city && (
                    <p className="text-xs text-red-500 mt-1">
                      {state.formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    State *
                  </label>
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

            <div className="flex gap-3 pt-4">
              <button
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-indigo-100 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Display Mode */}
          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
            <User size={20} className="text-indigo-600 font-bold shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold text-foreground">
                {user?.firstName + " " + user?.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
            <Mail size={20} className="text-indigo-600 font-bold shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
            <Phone size={20} className="text-indigo-600 font-bold  shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-semibold text-foreground">{user?.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
            <MapPin size={20} className="text-indigo-600 font-bold shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-semibold text-foreground">
                {user?.address.city}
              </p>
            </div>
          </div>
          {/* SUCCESS MESSAGE */}
          {state.success && showSuccess && (
            <p className="text-green-600 font-medium">
              ✅ Profile updated successfully
            </p>
          )}
        </div>
      )}
    </div>
  );
};
