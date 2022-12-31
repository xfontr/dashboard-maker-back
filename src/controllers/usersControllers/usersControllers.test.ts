import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import codes from "../../config/codes";
import { userMainIdentifier } from "../../config/database";
import User from "../../database/models/User";
import mockUser, { mockUserAdmin } from "../../test-utils/mocks/mockUser";
import camelToRegular from "../../utils/camelToRegular/camelToRegular";
import CodedError from "../../utils/CodedError/CodedError";
import FullToken from "../../utils/Token/FullToken";
import { getAllUsers, logInUser, registerUser } from "./usersControllers";
import Token from "../../database/models/Token";
import {
  mockFullToken,
  mockProtoToken,
} from "../../test-utils/mocks/mockToken";
import Errors from "../../services/Errors";
import CustomRequest from "../../types/CustomRequest";

let mockHashedPassword: string | Promise<never> = "validPassword";

beforeEach(() => {
  bcrypt.compare = jest.fn().mockResolvedValue("#");
  User.find = jest.fn().mockResolvedValue([mockUser]);
  User.create = jest.fn().mockResolvedValue(mockUser);
  Token.deleteMany = jest.fn();
  jest.clearAllMocks();
});

jest.mock("../../services/authentication/authentication", () => ({
  ...jest.requireActual("../../services/authentication/authentication"),
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

    test(`Then it should respond with a status of ${codes.success.ok}`, async () => {
      await getAllUsers(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(codes.success.ok);
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

    test(`Then it should respond with a status of ${codes.success.created} and a success message`, async () => {
      const successMessage = { register: "User registered successfully" };
      User.find = jest.fn().mockResolvedValue([]);

      await registerUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(codes.success.created);
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

        expect(next).toHaveBeenCalledWith(Errors.users.invalidRole);
        expect(res.status).not.toHaveBeenCalled();
      });
    });
  });
});

describe("Given a logInUser controller", () => {
  describe("When called with a request with user log in data, a response and a next function", () => {
    const req = {
      body: {
        [userMainIdentifier]: mockUser[userMainIdentifier],
        password: mockUser.password,
      },
      user: mockUser,
    } as CustomRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;

    test(`Then it should respond with a status of ${codes.success.ok} and a token`, async () => {
      const expectedResponse = FullToken(mockUser);

      await logInUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(codes.success.ok);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    describe("And the user password is incorrect", () => {
      test("Then it should call next with an error", async () => {
        const nextError = jest.fn() as NextFunction;

        bcrypt.compare = jest.fn().mockResolvedValue(false);

        await logInUser(req, res as Response, nextError);

        expect(nextError).toHaveBeenCalledWith(Errors.users.invalidPassword);
      });
    });
  });
});
