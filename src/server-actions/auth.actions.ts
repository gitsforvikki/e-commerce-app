"use server";

import { signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AuthError, ValidationError } from "@/lib/error";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

type AuthState = {
  success: boolean;
  error?: {
    message: string;
    field?: string;
    code?: string;
  };
};

export async function login(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
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

//register action can be added similarly

export async function register(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  try {
    // check and valdate the input
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName) {
      throw new ValidationError("First name is required", "firstName");
    }
    if (!lastName) {
      throw new ValidationError("Last name is required", "lastName");
    }
    if (!email) {
      throw new ValidationError("Email is required", "email");
    }
    if (!password) {
      throw new ValidationError("Password is required", "password");
    }
    //connect to db
    await connectDB();
    //check uuser already exists or not
    const user = await User.findOne({ email });
    if (user) {
      throw new AuthError("User already exists");
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    //save to db
    await newUser.save();

    //respond with success

    return { success: true };
  } catch (error: any) {
    console.error("Error during registration:", error);
    return {
      success: false,
      error: {
        message: error.message || "Registration failed",
        code: "REGISTRATION_FAILED",
      },
    };
  }
}
