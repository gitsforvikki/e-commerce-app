import { getCurrentUserData } from "@/services/user/user.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userInfo = await getCurrentUserData();
    return NextResponse.json(userInfo);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null });
  }
}
