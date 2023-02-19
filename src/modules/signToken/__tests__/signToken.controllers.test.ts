import { NextFunction, Response } from "express";
import bcrypt from "bcryptjs";
import HTTP_CODES from "../../../config/errorCodes";
import { generateSignToken, verifySignToken } from "../signToken.controllers";
import Token from "../SignToken.model";
import CodedError from "../../../common/utils/CodedError";
import camelToRegular from "../../../common/utils/camelToRegular";
import {
  mockFullToken,
  mockProtoToken,
} from "../../../common/test-utils/mocks/mockToken";
import CustomRequest from "../../../common/types/CustomRequest";
import mockPayload from "../../../common/test-utils/mocks/mockPayload";
import signTokenErrors from "../signToken.errors";
import userErrors from "../../user/users.errors";
import mockUser from "../../../common/test-utils/mocks/mockUser";

beforeEach(() => {
  Token.create = jest.fn().mockResolvedValue(mockFullToken);
  Token.find = jest.fn().mockResolvedValue([]);
  Token.deleteOne = jest.fn();
  jest.clearAllMocks();
});

const mockIsTokenRequired = jest.fn().mockReturnValue(true);

jest.mock("../../../config/database", () => ({
  ...jest.requireActual("../../../config/database"),
  get IS_TOKEN_REQUIRED() {
    return mockIsTokenRequired();
  },
}));

describe("Given a generateToken controller", () => {
  describe("When called with a request, a response and a next function", () => {
    const req = {
      token: mockProtoToken,
      payload: { ...mockPayload, role: "admin" },
    } as CustomRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;

    test(`Then it should respond with a status of ${HTTP_CODES.success.created} and a success message`, async () => {
      bcrypt.hash = () => Promise.resolve("#");

      const successMessage = { token: "Token created successfully" };

      await generateSignToken(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.success.created);
      expect(res.json).toHaveBeenCalledWith(successMessage);
    });

    describe("And the hash creation fails", () => {
      test("Then it should call next with an error and not respond", async () => {
        bcrypt.hash = () => Promise.reject(Error());

        const internalServerError = CodedError(
          "internalServerError",
          camelToRegular("internalServerError")
        )(Error());

        await generateSignToken(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(internalServerError);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe("And the token creation fails", () => {
      test("Then it should call next with an error and not respond", async () => {
        bcrypt.hash = () => Promise.resolve("#");

        Token.create = jest.fn().mockRejectedValue(Error());

        const badRequest = CodedError(
          "badRequest",
          camelToRegular("badRequest")
        )(Error());

        await generateSignToken(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(badRequest);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe("And the requesting user is not authorized", () => {
      test("Then it should call next with an error and not respond", async () => {
        const notAuthReq = {
          token: mockProtoToken,
          payload: { ...mockPayload, role: "user" },
        } as CustomRequest;

        await generateSignToken(notAuthReq, res as Response, next);

        expect(next).toHaveBeenCalledWith(signTokenErrors.unauthorizedToCreate);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
      });
    });
  });
});

describe("Given a verifyToken controller", () => {
  describe("When called with a request, a response and a next function", () => {
    const req = {
      body: mockProtoToken,
      token: mockFullToken,
    } as CustomRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;

    describe("If there is no token required", () => {
      test(`Then it should respond with a status of ${HTTP_CODES.success.ok} and the token`, async () => {
        mockIsTokenRequired.mockReturnValue(false);

        const response = { token: mockFullToken };

        await verifySignToken(req, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_CODES.success.ok);
        expect(res.json).toHaveBeenCalledWith(response);
      });
    });

    describe("If a token is required", () => {
      test("Then it should call next with error if the token is not valid", async () => {
        mockIsTokenRequired.mockReturnValue(true);

        await verifySignToken(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(userErrors.invalidToken);
      });
    });

    test("Then it should respond with a success status if the token is valid", async () => {
      bcrypt.compare = () => Promise.resolve(true);

      const reqWithToken = {
        body: mockUser,
        token: mockFullToken,
        headers: {
          authorization: `Bearer ${mockFullToken.code}`,
        },
      } as CustomRequest;

      mockIsTokenRequired.mockReturnValue(true);

      const response = { token: mockFullToken };

      await verifySignToken(reqWithToken, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.success.ok);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });
});
