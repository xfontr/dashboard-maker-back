import { NextFunction, Response } from "express";
import authorizationErrors from "../../../modules/authorization/authorization.errors";
import mockPayload from "../../test-utils/mocks/mockPayload";
import mockUser from "../../test-utils/mocks/mockUser";
import CustomRequest from "../../types/CustomRequest";
import authorization from "../authorization";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given an authorization middleware", () => {
  describe("When called with a request, response and next", () => {
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    describe("When called with an action name of 'CREATE_TOKEN' for a normal user", () => {
      test("Then it should call next if the user requesting is authorized", async () => {
        const req = {
          payload: { ...mockPayload, role: "admin" },
          user: { ...mockUser, role: "user" },
        } as CustomRequest;

        await authorization("CREATE_TOKEN", { affectsUser: "user" })(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
      });

      test("Then it should call next with an error if the request has no payload", async () => {
        const req = {
          user: { ...mockUser, role: "admin" },
        } as CustomRequest;

        await authorization("CREATE_TOKEN", { affectsUser: "user" })(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith(authorizationErrors.invalidRole);
        expect(next).toHaveBeenCalledTimes(1);
      });

      test("Then it should call next with an error if the request has no role", async () => {
        const req = {
          user: { ...mockUser, role: "admin" },
          payload: {},
        } as CustomRequest;

        await authorization("CREATE_TOKEN", { affectsUser: "user" })(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith(authorizationErrors.invalidRole);
        expect(next).toHaveBeenCalledTimes(1);
      });
    });

    describe("When called with an action name of 'CREATE_TOKEN' for an admin", () => {
      test("Then it should call next with an error if the user requesting is not authorized", async () => {
        const req = {
          payload: { ...mockPayload, role: "admin" },
          user: { ...mockUser, role: "admin" },
        } as CustomRequest;

        await authorization("CREATE_TOKEN", { affectsUser: "user" })(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith(authorizationErrors.invalidRole);
        expect(next).toHaveBeenCalledTimes(1);
      });

      test("Then it should call next if the user requesting is authorized", async () => {
        const req = {
          payload: { ...mockPayload, role: "owner" },
          user: { ...mockUser, role: "admin" },
        } as CustomRequest;

        await authorization("CREATE_TOKEN", { affectsUser: "user" })(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
      });
    });

    describe("When called with an action name of 'CREATE_TOKEN' for an owner", () => {
      test("Then it should call next if the user requesting has the maximum possible role, no matter the requested user", async () => {
        const req = {
          payload: { ...mockPayload, role: "superAdmin" },
          user: { ...mockPayload, role: "owner" },
        } as CustomRequest;

        await authorization("CREATE_TOKEN", { affectsUser: "user" })(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
      });
    });

    // This suite covers the use case where there are no affected users
    describe("When called with an action without options, like 'GET_ALL_USERS'", () => {
      test("Then it should call next if the user is admin or above", async () => {
        const req = {
          payload: { ...mockPayload, role: "owner" },
        } as CustomRequest;

        await authorization("GET_ALL_USERS")(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
      });
    });
  });
});
