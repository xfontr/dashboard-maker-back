import { NextFunction, Request, Response } from "express";
import HTTP_CODES from "../../../config/errorCodes";
import CodedError from "../../utils/CodedError";
import generalError from "../generalError";

const mockDebug = jest.fn();

jest.mock(
  "../../services/setDebug",
  () =>
    () =>
    (...args: unknown[]) =>
      mockDebug(...args)
);

describe("Given a generalError function (middleware)", () => {
  const req = {} as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next = jest.fn() as NextFunction;
  describe("When called with a internal server custom error", () => {
    const customError = CodedError("internalServerError")(Error());
    generalError(customError, req as Request, res as Response, next);

    test(`Then it should respond with a status of '${HTTP_CODES.error.internalServerError}'`, () => {
      expect(res.status).toHaveBeenCalledWith(
        HTTP_CODES.error.internalServerError
      );
    });

    test("Then it should respond with the error message", () => {
      expect(res.json).toHaveBeenCalledWith({
        error: customError.publicMessage,
      });
    });

    test("Then it should console the private error message", () => {
      expect(mockDebug).toHaveBeenCalledWith("error", customError.message);
    });
  });
});
