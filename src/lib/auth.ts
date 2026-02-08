import JWT from "jsonwebtoken";
import { cookies } from "next/headers";
const secret = process.env.JWT_SECRET;

export const signToken = (payload: Object) => {
  if (!secret) {
    throw new Error("❌ Please define JWT_SECRET in .env.local");
  }
  return JWT.sign(payload, secret, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  if (!secret) {
    throw new Error("❌ Please define JWT_SECRET in .env.local");
  }
  const decode = JWT.verify(token, secret);
  return decode as { userId: string; role: string; name: string };
};

//get user
export const getLoggedInUser = async () => {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return null;
    }
    const decoded = verifyToken(token);
    return decoded;
  } catch (err) {
    return null;
  }
};
