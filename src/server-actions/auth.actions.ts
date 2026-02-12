"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getLoggedInUser, signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AuthError, ValidationError } from "@/lib/error";
import { User } from "@/models/User";
import { registerUserValidator } from "@/validators/registerUserValidator";
import { mergeGuestCart } from "@/services/cart/merge-cart.service";
import { profileFormValidator } from "@/validators/profileValidator";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

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

type ProfileState = {
  success: boolean;
  updatedAt?: number;
  formErrors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phone?: string[];
    address?: string[];
    city?: string[];
    state?: string[];
    pincode?: string[];
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
    if (token) {
      await mergeGuestCart(user._id);
    }
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

export async function profileUpdateAction(
  prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  try {
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      home: formData.get("home"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
    };

    // ✅ Validate
    const parsed = profileFormValidator.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        formErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const validData = parsed.data;

    // ✅ Get logged user
    const user = await getLoggedInUser();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await connectDB();

    // ✅ UPDATE USER (NOT CREATE)
    await User.findByIdAndUpdate(
      user.userId,
      {
        firstName: validData.firstName,
        lastName: validData.lastName,
        phone: Number(validData.phone),
        address: {
          home: validData.home,
          city: validData.city,
          state: validData.state,
          pincode: Number(validData.pincode),
        },
      },
      { new: true }, // returns updated doc
    );
    return {
      success: true,
      updatedAt: Date.now(),
    };
  } catch (error: any) {
    console.error("Error during Profile update:", error);
    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}
