import { NextFunction } from "express";
import { Model } from "mongoose";
import IUser from "../../database/types/IUser";
import CodedError from "../../utils/CodedError/CodedError";
import ServeDatabase from "./ServeDatabase";

describe("Given a ServeDatabase factory function", () => {
  describe("When called with a database model and a next function", () => {
    const next = jest.fn() as NextFunction;

    test("Then it should return an getAll method to handle the model", async () => {
      const response = { users: ["Test"] };
      const model = {
        find: () => response,
      } as unknown as Partial<Model<IUser>>;

      const TestServe = ServeDatabase(model as Model<IUser>)(next);

      const result = await TestServe.getAll();

      expect(result).toStrictEqual(response);
    });

    test("Then it should call next with an error if the method throws an error", async () => {
      const error = new Error();
      const response = Promise.reject(error);

      const model = {
        find: () => response,
      } as unknown as Partial<Model<IUser>>;

      const TestServe = ServeDatabase(model as Model<IUser>)(next);

      await TestServe.getAll();

      expect(next).toHaveBeenCalledWith(
        CodedError("internalServerError", error)
      );
    });
  });
});
