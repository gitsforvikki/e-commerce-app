import { getLoggedInUser } from "@/lib/auth";
import { User } from "@/models/User";

export async function getCurrentUserData() {
  try {
    const userInfo = await getLoggedInUser();
    if (!userInfo?.userId) return null;
    const userFromDB = await User.findById(userInfo?.userId);
    if (!userInfo) return null;
    return {
      userId: userFromDB._id.toString(),
      role: userFromDB.role,
      firstName: userFromDB.firstName,
      lastName: userFromDB.lastName,
      email: userFromDB.email,
      phone: userFromDB.phone,
      address: userFromDB.address,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Error while fetch userinfo");
  }
}
