import { NextFunction, Request, Response } from "express";
import codes from "../config/codes";
import User from "../database/models/User";
import { getAllUsers } from "./usersControllers";

const response = ["Test"];
User.find = jest.fn().mockResolvedValueOnce(response);

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
      const expectedResponse = { users: response };

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
