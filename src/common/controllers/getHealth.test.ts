import { Request, Response } from "express";
import HTTP_CODES from "../../config/errorCodes";
import getHealth from "./getHealth";

describe("Given a getHealth controller", () => {
  describe("When called with with a request and a response", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    test(`Then it should respond with a status of ${HTTP_CODES.success.ok} and a user`, async () => {
      await getHealth(req, res as Response);

      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.success.ok);
      expect(res.json).toHaveBeenCalledWith({
        status: "Server is up and running",
      });
    });
  });
});
