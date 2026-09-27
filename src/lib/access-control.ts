import { connectDB } from "@/lib/db";
import { getLoggedInUser } from "@/lib/auth";
import { User } from "@/models/User";
import { Types } from "mongoose";

export class AccessDeniedError extends Error {
  constructor(message = "You are not authorized to perform this action") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

export async function requireUser() {
  const session = await getLoggedInUser();
  if (!session?.userId || !Types.ObjectId.isValid(session.userId)) {
    throw new AccessDeniedError("Authentication required");
  }

  await connectDB();
  const user = await User.findById(session.userId).select(
    "_id role firstName lastName email phone address",
  );
  if (!user) throw new AccessDeniedError("Authentication required");
  return user;
}

export async function requireRole(role: "ADMIN") {
  const user = await requireUser();
  if (String(user.role).toUpperCase() !== role) {
    throw new AccessDeniedError("Administrator access required");
  }
  return user;
}
