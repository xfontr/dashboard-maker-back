import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { userMainIdentifier } from "../../config/database";
import IUser from "../../database/types/IUser";
import mockUser from "../../test-utils/mocks/mockUser";
import CodedError from "../../utils/CodedError/CodedError";
import findItem from "./findItem";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a findItem middleware", () => {
  describe("When called with a model, an attribute and an error", () => {
    const conflictError = CodedError("conflict", "Error")(Error("Error"));
    const notFoundError = CodedError("notFound", "Error")(Error("Error"));

    describe("And when called with a request, a response and a next function", () => {
      const req = {
        body: mockUser,
      } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      test("Then it should find and call next if the finding doesn't match the error", async () => {
        const model = {
          find: (): IUser[] => [],
        } as unknown as Model<IUser>;

        await findItem(model, userMainIdentifier, conflictError)(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith();
      });

      test("Then it should call next with an error if the finding matches the error", async () => {
        const model = {
          find: () => [mockUser],
        } as unknown as Model<IUser>;

        await findItem(model, userMainIdentifier, conflictError)(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith(conflictError);
        expect(next).toHaveBeenCalledTimes(1);
      });

      describe("If there is a store parameter", () => {
        test("Then it should also save the item in the request body", async () => {
          const options = { store: true };
          const customReq = {
            body: mockUser,
          } as Request;

          const model = {
            find: (): IUser[] => [mockUser],
          } as unknown as Model<IUser>;

          await findItem(
            model,
            userMainIdentifier,
            notFoundError,
            options
          )(customReq, res, next);

          expect(req.body.item).toStrictEqual([mockUser]);
          expect(next).toHaveBeenCalledWith();
        });
      });

      describe("If there is a skip parameter", () => {
        test("Then it should directly skip to the next step calling next", async () => {
          const options = { skip: true };
          const cleanReq = {
            body: { ...mockUser, item: undefined },
          } as Request;

          const model = {
            find: jest.fn(),
          } as unknown as Model<IUser>;

          await findItem(
            model,
            userMainIdentifier,
            notFoundError,
            options
          )(cleanReq, res, next);

          expect(next).toHaveBeenCalledWith();
          expect(next).toHaveBeenCalledTimes(1);
          expect(cleanReq.body.item).toBeUndefined();
        });
      });
    });
  });
});
