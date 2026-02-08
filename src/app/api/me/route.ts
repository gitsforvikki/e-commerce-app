import { getLoggedInUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null });
  }
}
