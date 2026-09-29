import JWT from "jsonwebtoken";
import { cookies } from "next/headers";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("❌ Please define JWT_SECRET in .env.local");
  }
  return secret;
}

export const signToken = (payload: object) => {
  return JWT.sign(payload, getSecret(), { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  const decode = JWT.verify(token, getSecret());
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
  } catch {
    return null;
  }
};
