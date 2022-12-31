import { NextFunction, Response } from "express";
import { USER_MAIN_IDENTIFIER } from "../../../config/database";
import ENVIRONMENT from "../../../config/environment";
import mockPayload from "../../test-utils/mocks/mockPayload";
import mockUser, { mockUserSuperAdmin } from "../../test-utils/mocks/mockUser";
import CustomRequest from "../../types/CustomRequest";
import roleFilter from "../roleFilter";
import tokenErrors from "../../../modules/token/token.errors";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a roleFilter function", () => {
  describe("When called with a request, a response and a next function", () => {
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    describe("And the authority requesting the token has the right role", () => {
      const req = {
        authority: mockUserSuperAdmin,
        payload: mockPayload,
        body: mockUser,
      } as CustomRequest;

      test("Then it should call next to the following step", async () => {
        await roleFilter(req, res as Response, next);

        expect(next).toHaveBeenCalledWith();
      });
    });

    describe("And the authority requesting the token doesn't have the right role", () => {
      const req = {
        authority: mockUser,
        payload: mockPayload,
        body: mockUser,
      } as CustomRequest;

      test("Then it should call next with an error", async () => {
        await roleFilter(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(tokenErrors.unauthorizedToCreate);
      });
    });

    describe("And the request is made with the power token", () => {
      const req = {
        payload: {
          ...mockPayload,
          [USER_MAIN_IDENTIFIER]: ENVIRONMENT.defaultPowerEmail,
        },
        body: mockUser,
      } as CustomRequest;

      test("Then it should call next for the next step", async () => {
        await roleFilter(req, res as Response, next);

        expect(next).toHaveBeenCalledWith();
      });
    });
  });
});
