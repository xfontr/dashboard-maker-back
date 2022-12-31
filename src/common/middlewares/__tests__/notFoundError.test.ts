import { Request, Response } from "express";
import ERROR_CODES from "../../../config/errorCodes";
import notFoundError from "../notFoundError";

describe("Given a notFoundError function", () => {
  describe("When called with a request and a response as arguments", () => {
    const req = {} as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    test(`Then it should respond with a status of '${ERROR_CODES.error.notFound}'`, () => {
      notFoundError(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(ERROR_CODES.error.notFound);
    });

    test("Then it should send an error message", () => {
      const errorMessage = { error: "Endpoint not found" };
      notFoundError(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
});
