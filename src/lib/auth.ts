import JWT from "jsonwebtoken";
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
  return JWT.verify(token, secret);
};
