import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "./config";

const JWT_SECRET = config.SECRET_KEY!;
const JWT_EXPIRES_IN = config.TOKEN_EXPIRATION;
const BCRYPT_SALT_ROUNDS = config.BCRYPT_SALT_ROUNDS;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in env");
}

export interface JwtPayload {
  sub: string;
  role: "farmer" | "customer";
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const hashPassword = async (plain: string): Promise<string> => {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (
  plain: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
