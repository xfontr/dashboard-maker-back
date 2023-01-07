import { NextFunction, Request, Response } from "express";
import ERROR_CODES from "../../../config/errorCodes";
import { generateToken, verifyToken } from "../token.controllers";
import Token from "../Token.model";
import CodedError from "../../../common/utils/CodedError";
import camelToRegular from "../../../common/utils/camelToRegular";
import {
  mockFullToken,
  mockProtoToken,
} from "../../../common/test-utils/mocks/mockToken";

let mockCreatedHash: string | Promise<never> = "validPassword";

beforeEach(() => {
  Token.create = jest.fn().mockResolvedValue(mockFullToken);
  Token.find = jest.fn().mockResolvedValue([]);
  Token.deleteOne = jest.fn();
  jest.clearAllMocks();
});

jest.mock("../../../common/services/authentication", () => ({
  ...jest.requireActual("../../../common/services/authentication"),
  createHash: () => mockCreatedHash,
}));

describe("Given a generateToken controller", () => {
  describe("When called with a request, a response and a next function", () => {
    const req = {
      body: mockProtoToken,
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;

    test(`Then it should respond with a status of ${ERROR_CODES.success.created} and a success message`, async () => {
      const successMessage = { token: "Token created successfully" };

      await generateToken(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(ERROR_CODES.success.created);
      expect(res.json).toHaveBeenCalledWith(successMessage);
    });

    describe("And the hash creation fails", () => {
      test("Then it should call next with an error and not respond", async () => {
        mockCreatedHash = Promise.reject(new Error());

        const internalServerError = CodedError(
          "internalServerError",
          camelToRegular("internalServerError")
        )(Error());

        await generateToken(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(internalServerError);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe("And the token creation fails", () => {
      test("Then it should call next with an error and not respond", async () => {
        mockCreatedHash = "#";

        Token.create = jest.fn().mockRejectedValue(new Error());

        const badRequest = CodedError(
          "badRequest",
          camelToRegular("badRequest")
        )(Error());

        await generateToken(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(badRequest);
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
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    test(`Then it should respond with a status of ${ERROR_CODES.success.ok} and a success message`, async () => {
      const successMessage = { token: "The token requested is valid" };

      await verifyToken(req, res as Response);

      expect(res.status).toHaveBeenCalledWith(ERROR_CODES.success.ok);
      expect(res.json).toHaveBeenCalledWith(successMessage);
    });
  });
});
