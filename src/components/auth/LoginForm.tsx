"use client";

import { login } from "@/server-actions/auth.actions";
import { useActionState } from "react";

const initialState = { success: false };

export const LoginForm = () => {
  const [state, formAction] = useActionState(login, initialState);
  return (
    <div className="shadow bg-white py-4 px-3 rounded-3xl space-y-4 w-fit h-fit">
      <div className="mb-6 text-center space-y-2">
        <span className="text-2xl font-bold text-primary-foreground">A</span>
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
      </div>

      <form action={formAction}>
        <div className="flex flex-col gap-y-3">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-y-3">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  );
};
