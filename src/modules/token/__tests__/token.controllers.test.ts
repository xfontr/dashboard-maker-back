import { NextFunction, Response } from "express";
import bcrypt from "bcryptjs";
import ERROR_CODES from "../../../config/errorCodes";
import { generateToken, verifyToken } from "../token.controllers";
import Token from "../Token.model";
import CodedError from "../../../common/utils/CodedError";
import camelToRegular from "../../../common/utils/camelToRegular";
import {
  mockFullToken,
  mockProtoToken,
} from "../../../common/test-utils/mocks/mockToken";
import CustomRequest from "../../../common/types/CustomRequest";
import mockPayload from "../../../common/test-utils/mocks/mockPayload";
import tokenErrors from "../token.errors";

beforeEach(() => {
  Token.create = jest.fn().mockResolvedValue(mockFullToken);
  Token.find = jest.fn().mockResolvedValue([]);
  Token.deleteOne = jest.fn();
  jest.clearAllMocks();
});

describe("Given a generateToken controller", () => {
  describe("When called with a request, a response and a next function", () => {
    const req = {
      body: mockProtoToken,
      payload: { ...mockPayload, role: "admin" },
    } as CustomRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;

    test(`Then it should respond with a status of ${ERROR_CODES.success.created} and a success message`, async () => {
      bcrypt.hash = () => Promise.resolve("#");

      const successMessage = { token: "Token created successfully" };

      await generateToken(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(ERROR_CODES.success.created);
      expect(res.json).toHaveBeenCalledWith(successMessage);
    });

    describe("And the hash creation fails", () => {
      test("Then it should call next with an error and not respond", async () => {
        bcrypt.hash = () => Promise.reject(Error());

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
        bcrypt.hash = () => Promise.resolve("#");

        Token.create = jest.fn().mockRejectedValue(Error());

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

    describe("And the requesting user is not authorized", () => {
      test("Then it should call next with an error and not respond", async () => {
        const notAuthReq = {
          body: mockProtoToken,
          payload: { ...mockPayload, role: "user" },
        } as CustomRequest;

        await generateToken(notAuthReq, res as Response, next);

        expect(next).toHaveBeenCalledWith(tokenErrors.unauthorizedToCreate);
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

    test(`Then it should respond with a status of ${ERROR_CODES.success.ok} and the token`, async () => {
      const response = { token: mockFullToken };

      await verifyToken(req, res as Response);

      expect(res.status).toHaveBeenCalledWith(ERROR_CODES.success.ok);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });
});
