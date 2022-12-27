import { NextFunction } from "express";
import CodedError, { Codes } from "../CodedError/CodedError";
import catchCodedError from "./catchCodedError";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a catchCodedError function that returns another function", () => {
  const next = jest.fn() as NextFunction;
  const callbackArgument = {};

  describe("When called the returned function with a callback function", () => {
    test("Then it should return the returned value of said callback", async () => {
      const response = { users: ["User"] };
      const callback = jest.fn().mockResolvedValue(response);
      const tryThis = catchCodedError(next);

      const result = await tryThis(callback, callbackArgument);

      expect(result).toStrictEqual(response);
    });

    describe("And the callback throws an error", () => {
      test("Then it should call next with said error", async () => {
        const error = new Error();
        const callbackWithError = jest.fn().mockRejectedValue(error);

        const expectedError = CodedError("internalServerError", error);

        const tryThis = catchCodedError(next);

        await tryThis(callbackWithError, callbackArgument);

        expect(next).toHaveBeenCalledWith(expectedError);
      });
    });
  });

  describe("When called the returned function with a callback function and a error type", () => {
    describe("And the callback throws an error", () => {
      test("Then it should call next with the custom error", async () => {
        const error = new Error();
        const callbackWithError = jest.fn().mockRejectedValue(error);
        const customError: Codes = "badRequest";

        const expectedError = CodedError(customError, error);

        const tryThis = catchCodedError(next);

        await tryThis(callbackWithError, callbackArgument, customError);

        expect(next).toHaveBeenCalledWith(expectedError);
      });
    });
  });
});
