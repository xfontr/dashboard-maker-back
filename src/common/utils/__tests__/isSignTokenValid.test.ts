import { NextFunction } from "express";
import bcrypt from "bcryptjs";
import isSignTokenValid from "../isSignTokenValid";
import { MAIN_IDENTIFIER } from "../../../config/database";
import CustomRequest from "../../types/CustomRequest";
import mockUser from "../../test-utils/mocks/mockUser";
import { mockFullToken } from "../../test-utils/mocks/mockToken";
import userErrors from "../../../modules/user/users.errors";

beforeEach(() => {
  jest.clearAllMocks();
  bcrypt.compare = jest.fn().mockResolvedValue("#");
});

describe("Given a checkToken middleware", () => {
  describe("When called with a request, a response and a next function", () => {
    const req = {
      body: { ...mockUser },
      token: mockFullToken,
      headers: {
        authorization: `Bearer ${mockFullToken.code}`,
      },
    } as CustomRequest;
    const next = jest.fn() as NextFunction;

    describe("And there is a valid existent token", () => {
      test("Then it should return true and not call next", async () => {
        const result = await isSignTokenValid(req, next);

        expect(next).not.toHaveBeenCalled();
        expect(result).toBeTruthy();
      });
    });

    describe("And there is no valid code specified in the headers", () => {
      test("Then it should call next with an error", async () => {
        const invalidReq = {
          ...req,
          headers: { authorization: "invalidToken" },
        } as CustomRequest;

        const result = await isSignTokenValid(invalidReq, next);

        expect(next).toHaveBeenCalledWith(userErrors.invalidToken);
        expect(next).toHaveBeenCalledTimes(1);
        expect(result).toBeFalsy();
      });
    });

    describe("And the token identifier doesn't match the user identifier", () => {
      test("Then it should call next with an error", async () => {
        const invalidReq = {
          ...req,
          body: {
            ...mockUser,
            [MAIN_IDENTIFIER]: "randomStuff",
            item: [mockFullToken],
          },
        } as CustomRequest;

        await isSignTokenValid(invalidReq, next);

        expect(next).toHaveBeenCalledWith(userErrors.invalidToken);
        expect(next).toHaveBeenCalledTimes(1);
      });
    });

    describe("And the token code is not valid", () => {
      test("Then it should call next with an error", async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        const result = await isSignTokenValid(req, next);

        expect(next).toHaveBeenCalledWith(userErrors.invalidToken);
        expect(next).toHaveBeenCalledTimes(1);
        expect(result).toBeFalsy();
      });
    });

    describe("And called with a skip option", () => {
      test("Then it should do nothing and skip to the next step", async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        const result = await isSignTokenValid(req, next, true);

        expect(next).not.toHaveBeenCalled();
        expect(result).toBeTruthy();
      });
    });

    describe("And the token allows to skip code validation", () => {
      test("Then it should directly skip to the next step", async () => {
        bcrypt.compare = jest.fn();

        const skipReq = {
          ...req,
          body: {
            ...mockUser,
            [MAIN_IDENTIFIER]: "randomStuff",
          },
          token: { ...mockFullToken, isCodeRequired: false },
        } as CustomRequest;

        const result = await isSignTokenValid(skipReq, next);

        expect(next).not.toHaveBeenCalled();
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(result).toBeTruthy();
      });
    });
  });
});
