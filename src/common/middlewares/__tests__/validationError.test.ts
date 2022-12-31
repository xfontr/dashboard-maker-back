import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import codes from "../../../config/codes";
import validationError from "../validationError";

const mockDebug = jest.fn();

jest.mock(
  "../../services/setDebug",
  () =>
    () =>
    (...args: unknown[]) =>
      mockDebug(...args)
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a validationError middleware", () => {
  const req = {} as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn() as NextFunction;

  describe("When called with a joi error", () => {
    const joiError = new ValidationError(
      {
        body: [
          {
            message: "Error",
            isJoi: true,
            details: [],
            _original: "",
            name: "ValidationError",
            annotate: () => "",
          },
        ],
      },
      {}
    );

    test(`Then it should respond with a status of '${codes.error.badRequest}' and a error message`, () => {
      validationError(joiError, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(codes.error.badRequest);
      expect(res.json).toHaveBeenCalledWith({ error: "Bad Request" });
    });

    test("Then it should console all the errors", () => {
      validationError(joiError, req, res as Response, next);

      expect(mockDebug).toHaveBeenCalledTimes(2);
    });
  });

  describe("When called with a normal error", () => {
    test("Then it should call next with the error", () => {
      const error = Error();

      validationError(error, req, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
