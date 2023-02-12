import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AUTH_TOKEN_EXPIRATION } from "../../config/database";
import ENVIRONMENT from "../../config/environment";
import Payload from "../types/Payload";

/**
 * Creates a hash with a salt of 10 out of the string received. The actual
 * purpose is to hash passwords
 */

export const createHash = (password: string): Promise<string> => {
  const salt = 10;
  return bcrypt.hash(password, salt);
};

/**
 * Checks if a hash matches an un-hashed value. Used to verify if a database
 * hashed password matches the request password
 */

export const compareHash = (
  dataToCompare: string,
  hash: string
): Promise<boolean> => bcrypt.compare(dataToCompare, hash);

const baseCreateToken =
  (secret: string, expiresIn: string) => (payload: Payload) =>
    jwt.sign(payload, secret, { expiresIn });

/**
 * Creates a token out of the environment authentication secret. The expiration
 * time is established in the config files
 */

export const createToken = baseCreateToken(
  ENVIRONMENT.authSecret,
  AUTH_TOKEN_EXPIRATION.token
);

/**
 * Creates a refresh token out of the environment refresh authentication secret.
 * The expiration time is established in the config files
 */

export const createRefreshToken = baseCreateToken(
  ENVIRONMENT.refreshAuthSecret,
  AUTH_TOKEN_EXPIRATION.refreshToken
);

export const baseVerifyToken =
  (secret: string) =>
  (token: string): string | JwtPayload =>
    jwt.verify(token, secret);

/**
 * Verifies that the string (a token) matches the authentication environment
 * secret with which the token was created.
 */

export const verifyToken = baseVerifyToken(ENVIRONMENT.authSecret);

/**
 * Verifies that the string (a refresh token) matches the refresh authentication
 * environment secret with which the token was created.
 */

export const verifyRefreshToken = baseVerifyToken(
  ENVIRONMENT.refreshAuthSecret
);
