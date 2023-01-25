import "../../../loadEnvironment";
import bcrypt from "bcryptjs";
import Payload from "../../types/Payload";
import {
  createToken,
  compareHash,
  createHash,
  verifyToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../authentication";
import ENVIRONMENT from "../../../config/environment";
import { AUTH_TOKEN_EXPIRATION } from "../../../config/database";

const mockJwtPayload = { id: "", iat: 1512341253 };

const mockSign = jest.fn().mockReturnValue("#");
const mockVerify = jest.fn().mockReturnValue(mockJwtPayload);

jest.mock("jsonwebtoken", () => ({
  sign: (payload: Payload, secret: string, options: object) =>
    mockSign(payload, secret, options),
  verify: (token: string, secret: string) => mockVerify(token, secret),
}));

beforeEach(() => jest.clearAllMocks());

describe("Given a hashCreate function", () => {
  describe("When instantiated with a password as an argument", () => {
    test("Then it should call bcrypt with said password and a salt of 10, and return its returned value", () => {
      const password = "admin";
      const salt = 10;

      bcrypt.hash = jest.fn().mockReturnValue("#");

      const returnedValue = createHash(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(returnedValue).toBe("#");
    });
  });
});

describe("Given a createToken function", () => {
  describe("When called with a payload as an argument", () => {
    test("Then it should call jwt and return its returned value", () => {
      const mockToken: Payload = {
        id: "1234",
        email: "aaa",
      };

      const returnedValue = createToken(mockToken);

      expect(mockSign).toHaveBeenCalledWith(mockToken, ENVIRONMENT.authSecret, {
        expiresIn: AUTH_TOKEN_EXPIRATION.token,
      });
      expect(returnedValue).toBe("#");
    });
  });
});

describe("Given a createRefreshToken function", () => {
  describe("When called with a payload as an argument", () => {
    test("Then it should call jwt and return its returned value", () => {
      const mockToken: Payload = {
        id: "1234",
        email: "aaa",
      };

      const returnedValue = createRefreshToken(mockToken);

      expect(mockSign).toHaveBeenCalledWith(
        mockToken,
        ENVIRONMENT.refreshAuthSecret,
        {
          expiresIn: AUTH_TOKEN_EXPIRATION.refreshToken,
        }
      );
      expect(returnedValue).toBe("#");
    });
  });
});

describe("Given a hashCompare function", () => {
  describe("When called with two strings (a hash and a hash  to compare)", () => {
    test("Then it should call bcrypt compare with said arguments and return its returned value", () => {
      const hashToCompare = "#";
      const hash = "#";

      bcrypt.compare = jest.fn().mockReturnValue("#");

      const returnedValue = compareHash(hashToCompare, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(hashToCompare, hash);
      expect(returnedValue).toBe("#");
    });
  });
});

describe("Given a verifyToken function", () => {
  describe("When called with a strings (a token)", () => {
    test("Then it should call jwt to verify it matches the secret and return a valid payload object", () => {
      const returnedValue = verifyToken("token");

      expect(mockVerify).toHaveBeenCalledWith("token", ENVIRONMENT.authSecret);
      expect(returnedValue).toBe(mockJwtPayload);
    });
  });
});

describe("Given a verifyRefreshToken function", () => {
  describe("When called with a strings (a token)", () => {
    test("Then it should call jwt to verify it matches the secret and return a valid payload object", () => {
      const returnedValue = verifyRefreshToken("token");

      expect(mockVerify).toHaveBeenCalledWith(
        "token",
        ENVIRONMENT.refreshAuthSecret
      );
      expect(returnedValue).toBe(mockJwtPayload);
    });
  });
});
