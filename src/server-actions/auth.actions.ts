"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AuthError, ValidationError } from "@/lib/error";
import { User } from "@/models/User";
import { registerUserValidator } from "@/validators/registerUserValidator";

type AuthState = {
  success: boolean;
  formErrors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  };
  error?: string;
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
    const token = signToken({
      userId: user._id,
      role: user.role,
      name: user.firstName,
    });
    // return token in cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error during login:", error);
    return {
      success: false,
      error: "Failed to login",
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

    //create user
    const rawUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    const validatedUser = registerUserValidator.safeParse(rawUser);
    if (!validatedUser.success) {
      return {
        success: false,
        formErrors: validatedUser.error.flatten().fieldErrors,
      };
    }

    //connect to db
    await connectDB();
    //check uuser already exists or not
    const user = await User.findOne({ email });
    if (user) {
      throw new AuthError("User already exists");
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(validatedUser.data.password, 10);

    //create new user with hashed password
    const newUser = new User({
      ...validatedUser.data,
      password: hashedPassword,
    });

    //save to db
    await newUser.save();

    //respond with success

    // return { success: true };
  } catch (error: any) {
    console.error("Error during registration:", error);
    return {
      success: false,
      error: "Failed to register user",
    };
  }
  redirect("/login");
}
