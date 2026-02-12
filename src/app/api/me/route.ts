import { getLoggedInUser } from "@/lib/auth";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    const userFromDB = await User.findById(user.userId).select(
      "firstName lastName role _id email phone address",
    );

    return NextResponse.json({
      user: {
        userId: userFromDB._id.toString(),
        role: userFromDB.role,
        firstName: userFromDB.firstName,
        lastName: userFromDB.lastName,
        email: userFromDB.email,
        phone: userFromDB.phone,
        address: userFromDB.address,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null });
  }
}
