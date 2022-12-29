import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import codes from "../config/codes";
import userMainIdentifier from "../config/database";
import User from "../database/models/User";
import mockUser from "../test-utils/mocks/mockUser";
import camelToRegular from "../utils/camelToRegular/camelToRegular";
import CodedError from "../utils/CodedError/CodedError";
import Token from "../utils/Token/Token";
import { getAllUsers, logInUser, registerUser } from "./usersControllers";

let mockHashedPassword: string | Promise<never> = "validPassword";

beforeEach(() => {
  bcrypt.compare = jest.fn().mockResolvedValue("#");
  User.find = jest.fn().mockResolvedValue([mockUser]);
  User.create = jest.fn().mockResolvedValue(mockUser);
});

jest.mock("../services/authentication/authentication", () => ({
  ...jest.requireActual("../services/authentication/authentication"),
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

    test("Then it should respond with the data found", () => {
      const expectedResponse = { users: [mockUser] };

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
    });

    describe("And the user already exists", () => {
      test("Then it should call next with an error", async () => {
        const expectedError = CodedError(
          "conflict",
          "Invalid sign up data"
        )(Error("There's a user using the same email"));

        await registerUser(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(expectedError);
      });
    });

    describe("And the hashing of the password fails", () => {
      test("Then it should call next with an errror", async () => {
        User.find = jest.fn().mockResolvedValue([]);
        mockHashedPassword = Promise.reject(new Error());

        const expectedError = CodedError(
          "internalServerError",
          camelToRegular("internalServerError")
        )(Error());

        await registerUser(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(expectedError);
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
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;

    test(`Then it should respond with a status of ${codes.success.ok} and a token`, async () => {
      const expectedResponse = Token(mockUser);

      await logInUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(codes.success.ok);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    describe("And the user doesn't exist", () => {
      test("Then it should call next with an error", async () => {
        User.find = jest.fn().mockResolvedValue([]);

        const expectedError = CodedError(
          "notFound",
          `Invalid ${userMainIdentifier} or password`
        )(Error("User doesn't exist"));

        await logInUser(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(expectedError);
      });
    });

    describe("And the user password is incorrect", () => {
      test("Then it should call next with an error", async () => {
        const nextError = jest.fn() as NextFunction;

        bcrypt.compare = jest.fn().mockResolvedValue(false);

        const expectedError = CodedError(
          "badRequest",
          `Invalid ${userMainIdentifier} or password`
        )(Error("Invalid password"));

        await logInUser(req, res as Response, nextError);

        expect(nextError).toHaveBeenCalledWith(expectedError);
      });
    });
  });
});
