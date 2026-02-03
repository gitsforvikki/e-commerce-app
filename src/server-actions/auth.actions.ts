"use server";

import { User } from "@/models/User";

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

 // check user exist or not

const user = await User.findOne({ email });
if(!user){
  throw new Error("User not found");
}
 //compare password


 //create token

 // return token in cookie

 //respond with success
  } catch (error) {
    console.error("Error during login:", error);
  }
}
