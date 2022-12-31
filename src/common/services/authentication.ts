import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import environment from "../../config/environment";
import Payload from "../types/Payload";

export const createHash = (password: string): Promise<string> => {
  const salt = 10;
  return bcrypt.hash(password, salt);
};

export const compareHash = (
  dataToCompare: string,
  hash: string
): Promise<boolean> => bcrypt.compare(dataToCompare, hash);

export const createToken = (payload: Payload): string =>
  jwt.sign(payload, environment.authSecret);

export const verifyToken = (token: string): string | JwtPayload =>
  jwt.verify(token, environment.authSecret);
