import { Request, Response } from "express";
import codes from "../../config/codes";
import notFoundError from "./notFoundError";

describe("Given a notFoundError function", () => {
  describe("When called with a request and a response as arguments", () => {
    const req = {} as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    test(`Then it should respond with a status of '${codes.error.notFound}'`, () => {
      notFoundError(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(codes.error.notFound);
    });

    test("Then it should send an error message", () => {
      const errormessage = { error: "Endpoint not found" };
      notFoundError(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(errormessage);
    });
  });
});
