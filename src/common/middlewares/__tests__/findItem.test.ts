import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { MAIN_IDENTIFIER } from "../../../config/database";
import IUser from "../../../modules/user/users.types";
import mockUser from "../../test-utils/mocks/mockUser";
import CustomRequest from "../../types/CustomRequest";
import { FindOptions } from "../../types/requestOptions";
import CodedError from "../../utils/CodedError";
import findItem from "../findItem";

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

      describe("If the attribute specified is not defined", () => {
        test("Then it should call next with an error", async () => {
          const expectedError = CodedError(
            "badRequest",
            "Invalid request"
          )(Error(`The attribute ${MAIN_IDENTIFIER} is not defined`));

          const model = {
            find: (): IUser[] => [],
          } as unknown as Model<IUser>;

          const mockUndefinedReq = {
            body: { ...req.body, [MAIN_IDENTIFIER]: undefined },
          } as Request;

          await findItem(model, {})({ specialError: conflictError })(
            mockUndefinedReq,
            res,
            next
          );

          expect(next).toHaveBeenCalledWith(expectedError);
          expect(next).toHaveBeenCalledTimes(1);
        });
      });

      test("Then it should find and call next if the finding doesn't match the error", async () => {
        const model = {
          find: (): IUser[] => [],
        } as unknown as Model<IUser>;

        await findItem(model, {})({ specialError: conflictError })(
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

        await findItem(model, {})({ specialError: conflictError })(
          req,
          res,
          next
        );

        expect(next).toHaveBeenCalledWith(conflictError);
        expect(next).toHaveBeenCalledTimes(1);
      });

      describe("If there is a store parameter", () => {
        test("Then it should also save the item in the request body", async () => {
          const options: FindOptions<unknown> = {
            storeAt: "token",
            specialError: notFoundError,
          };
          const customReq = {
            body: mockUser,
          } as CustomRequest;

          const model = {
            find: (): IUser[] => [mockUser],
          } as unknown as Model<IUser>;

          await findItem(model, {})(options)(customReq, res, next);

          expect(customReq.token).toStrictEqual(mockUser);
          expect(next).toHaveBeenCalledWith();
        });
      });

      describe("If there is a skip parameter", () => {
        test("Then it should directly skip to the next step calling next", async () => {
          const options = { skip: true, specialError: notFoundError };
          const cleanReq = {
            body: { ...mockUser, item: undefined },
          } as Request;

          const model = {
            find: jest.fn(),
          } as unknown as Model<IUser>;

          await findItem(model, {})(options)(cleanReq, res, next);

          expect(next).toHaveBeenCalledWith();
          expect(next).toHaveBeenCalledTimes(1);
          expect(cleanReq.body.item).toBeUndefined();
        });
      });
    });
  });
});
