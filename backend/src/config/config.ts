import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  SECRET_KEY: process.env.SECRET_KEY || "excellencyinprogramming",
  TOKEN_EXPIRATION: 60 * 60 * 15,
  MONGODB_URI: process.env.MONGODB_URI as string,
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
  PORT: parseInt(process.env.PORT || "3000", 10),
};
