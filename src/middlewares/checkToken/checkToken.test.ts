import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { mockProtoToken } from "../../test-utils/mocks/mockToken";
import mockUser from "../../test-utils/mocks/mockUser";
import checkToken from "./checkToken";
import { invalidToken } from "../../server/routers/usersRouter/usersRouter.errors";
import { userMainIdentifier } from "../../config/database";

beforeEach(() => {
  jest.clearAllMocks();
  bcrypt.compare = jest.fn().mockResolvedValue("#");
});

describe("Given a checkToken middleware", () => {
  describe("When called with a request, a response and a next function", () => {
    const req = {
      body: { ...mockUser, item: [mockProtoToken] },
      headers: {
        authorization: `Bearer ${mockProtoToken.code}`,
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    describe("And there is a valid existent token", () => {
      test("Then it should call next to the following step", async () => {
        await checkToken(req, res, next);

        expect(next).toHaveBeenCalledWith();
      });
    });

    describe("And there is no valid code specified in the headers", () => {
      test("Then it should call next with an error", async () => {
        const invalidReq = {
          ...req,
          headers: { authorization: "invalidToken" },
        } as Request;

        await checkToken(invalidReq, res, next);

        expect(next).toHaveBeenCalledWith(invalidToken);
        expect(next).toHaveBeenCalledTimes(1);
      });
    });

    describe("And the token identifier doesn't match the user identifier", () => {
      test("Then it should call next with an error", async () => {
        const invalidReq = {
          ...req,
          body: {
            ...mockUser,
            [userMainIdentifier]: "randomStuff",
            item: [mockProtoToken],
          },
        } as Request;

        await checkToken(invalidReq, res, next);

        expect(next).toHaveBeenCalledWith(invalidToken);
        expect(next).toHaveBeenCalledTimes(1);
      });
    });

    describe("And the token code is not valid", () => {
      test("Then it should call next with an error", async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        await checkToken(req, res, next);

        expect(next).toHaveBeenCalledWith(invalidToken);
        expect(next).toHaveBeenCalledTimes(1);
      });
    });
  });
});
