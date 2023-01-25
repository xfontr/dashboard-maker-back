import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import ERROR_CODES from "../../../config/errorCodes";
import { MAIN_IDENTIFIER } from "../../../config/database";
import User from "../User.model";
import camelToRegular from "../../../common/utils/camelToRegular";
import CodedError from "../../../common/utils/CodedError";
import FullToken from "../utils/FullToken/FullToken";
import { getAllUsers, logInUser, registerUser } from "../users.controllers";
import Token from "../../token/Token.model";
import CustomRequest from "../../../common/types/CustomRequest";
import mockUser, {
  mockUserAdmin,
} from "../../../common/test-utils/mocks/mockUser";
import {
  mockFullToken,
  mockProtoToken,
} from "../../../common/test-utils/mocks/mockToken";
import userErrors from "../users.errors";

let mockHashedPassword: string | Promise<never> = "validPassword";

beforeEach(() => {
  bcrypt.compare = jest.fn().mockResolvedValue("#");
  User.find = jest.fn().mockResolvedValue([mockUser]);
  User.create = jest.fn().mockResolvedValue(mockUser);
  Token.deleteMany = jest.fn();
  jest.clearAllMocks();
});

jest.mock("../../../common/services/authentication", () => ({
  ...jest.requireActual("../../../common/services/authentication"),
  createHash: () => mockHashedPassword,
}));

describe("Given a getAllUsers controller", () => {
  describe("When called with a request, a response and a next function", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;

    test(`Then it should respond with a status of ${ERROR_CODES.success.ok}`, async () => {
      await getAllUsers(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(ERROR_CODES.success.ok);
    });

    test("Then it should respond with the data found", async () => {
      const expectedResponse = { users: [mockUser] };

      await getAllUsers(req, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

describe("Given a registerUser controller", () => {
  describe("When called with a request with a user, a response and a next function", () => {
    const req = {
      body: mockUser,
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;

    test(`Then it should respond with a status of ${ERROR_CODES.success.created} and a success message`, async () => {
      const successMessage = { register: "User registered successfully" };
      User.find = jest.fn().mockResolvedValue([]);

      await registerUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(ERROR_CODES.success.created);
      expect(res.json).toHaveBeenCalledWith(successMessage);
      expect(Token.deleteMany).not.toHaveBeenCalled();
    });

    test("Then it should delete the token, if any", async () => {
      const reqWithToken = {
        body: { ...mockUser },
        token: mockProtoToken,
      } as CustomRequest;

      User.find = jest.fn().mockResolvedValue([]);

      await registerUser(reqWithToken, res as Response, next);

      expect(Token.deleteMany).toHaveBeenCalled();
    });

    describe("And the hashing of the password fails", () => {
      test("Then it should call next with an error", async () => {
        User.find = jest.fn().mockResolvedValue([]);
        mockHashedPassword = Promise.reject(new Error());

        const internalServerError = CodedError(
          "internalServerError",
          camelToRegular("internalServerError")
        )(Error());

        await registerUser(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(internalServerError);
      });
    });

    describe("And the creation of the user fails", () => {
      test("Then it should not call the response methods", async () => {
        User.find = jest.fn().mockResolvedValue([]);
        User.create = jest.fn().mockRejectedValue(new Error());
        mockHashedPassword = "validPassword";

        const badRequest = CodedError(
          "badRequest",
          camelToRegular("badRequest")
        )(Error());

        await registerUser(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(badRequest);
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe("And the token role doesn't match the user role", () => {
      test("Then it should call next with an error", async () => {
        const reqWithBadRole = {
          body: mockUserAdmin,
          token: { ...mockFullToken, role: "user" },
        } as CustomRequest;

        User.find = jest.fn().mockResolvedValue([]);
        mockHashedPassword = "validPassword";

        await registerUser(reqWithBadRole, res as Response, next);

        expect(next).toHaveBeenCalledWith(userErrors.invalidRole);
        expect(res.status).not.toHaveBeenCalled();
      });
    });
  });
});

describe("Given a logInUser controller", () => {
  describe("When called with a request with user log in data, a response and a next function", () => {
    const req = {
      body: {
        [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
        password: mockUser.password,
      },
      user: mockUser,
    } as CustomRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Partial<Response>;
    const next = jest.fn() as NextFunction;

    test(`Then it should respond with a status of ${ERROR_CODES.success.ok} and a token`, async () => {
      const expectedResponse = FullToken(mockUser);

      await logInUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(ERROR_CODES.success.ok);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
      expect(res.cookie).toHaveBeenCalled();

      const cookieCalled = (res.cookie as jest.Mock).mock.calls[0];
      const tokenInitialLetters = "ey";
      const cookieOptions = {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      };

      expect(cookieCalled[0]).toBe("authToken");
      expect(cookieCalled[1].startsWith(tokenInitialLetters)).toBeTruthy();
      expect(cookieCalled[2]).toStrictEqual(cookieOptions);
    });

    describe("And the user password is incorrect", () => {
      test("Then it should call next with an error", async () => {
        const nextError = jest.fn() as NextFunction;

        bcrypt.compare = jest.fn().mockResolvedValue(false);

        await logInUser(req, res as Response, nextError);

        expect(nextError).toHaveBeenCalledWith(userErrors.invalidPassword);
      });
    });
  });
});
