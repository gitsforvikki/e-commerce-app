"use server";

import { signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AuthError, ValidationError } from "@/lib/error";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

type LoginResponse = {
  success: boolean;
  error?: {
    message: string;
    code?: string;
    field?: string;
  };
};

export async function login(formData: FormData): Promise<LoginResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    //check for user input
    if (!email) {
      throw new ValidationError("Email is required", "email");
    }
    if (!password) {
      throw new ValidationError("Password is required", "password");
    }

    //connect to db
    await connectDB();

    // check user exist or not
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthError("Invalid credentials");
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthError("Invalid credentials");
    }
    //create token
    const token = signToken({ userId: user._id, role: user.role });
    // return token in cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    //respond with success
    return { success: true };
    return { success: true };
  } catch (error: any) {
    console.error("Error during login:", error);
    return {
      success: false,
      error: {
        message: error.message || "Login failed",
        code: "LOGIN_FAILED",
      },
    };
  }
}
