import { NextFunction } from "express";
import { Model } from "mongoose";
import IUser from "../../database/types/IUser";
import camelToRegular from "../../utils/camelToRegular/camelToRegular";
import CodedError from "../../utils/CodedError/CodedError";
import ServeDatabase from "./ServeDatabase";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a ServeDatabase factory function", () => {
  describe("When called with a database model and a next function", () => {
    const next = jest.fn() as NextFunction;

    describe("Then it should return a getAll method that should", () => {
      test("call the find method and return its response", async () => {
        const response = { users: ["Test"] };
        const model = {
          find: jest.fn().mockResolvedValue(response),
        } as unknown as Partial<Model<IUser>>;

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        const result = await TestServe.getAll();

        expect(result).toStrictEqual(response);
        expect(model.find).toHaveBeenCalled();
      });

      test("Then it should call next with an error if the method throws an error", async () => {
        const error = new Error();
        const response = Promise.reject(error);
        const errorType = "internalServerError";

        const model = {
          find: () => response,
        } as unknown as Partial<Model<IUser>>;

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        await TestServe.getAll();

        expect(next).toHaveBeenCalledWith(
          CodedError(errorType, camelToRegular(errorType))(error)
        );
      });
    });

    describe("Then it should return a getByAttrbiute method that should", () => {
      test("call the find method with specific parameters and return its response", async () => {
        const response = { users: ["Test"] };
        const model = {
          find: jest.fn().mockResolvedValue(response),
        } as unknown as Partial<Model<IUser>>;

        const attribute = "email";
        const value = "test@test.com";

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        const result = await TestServe.getByAttribute(attribute, value);

        expect(result).toStrictEqual(response);
        expect(model.find).toHaveBeenCalledWith({ [attribute]: value });
      });

      test("return an error if the document exists, if specified in the parameters", async () => {
        const response = ["Test"];
        const model = {
          find: jest.fn().mockResolvedValue(response),
        } as unknown as Partial<Model<IUser>>;

        const attribute = "email";
        const value = "test@test.com";
        const error = CodedError("conflict")(Error());

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        const result = await TestServe.getByAttribute(attribute, value, error);

        expect(next).toHaveBeenCalledWith(error);
        expect(result).toBe(true);
      });

      test("return an error if the document doesn't exist, if specified in the parameters", async () => {
        const response: unknown[] = [];
        const model = {
          find: jest.fn().mockResolvedValue(response),
        } as unknown as Partial<Model<IUser>>;

        const attribute = "email";
        const value = "test@test.com";
        const error = CodedError("notFound")(Error());

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        const result = await TestServe.getByAttribute(attribute, value, error);

        expect(next).toHaveBeenCalledWith(error);
        expect(result).toBe(true);
      });
    });

    describe("Then it should return a create method that should", () => {
      test("call the method to create a document", async () => {
        const user = { name: "Test" } as IUser;
        const model = {
          create: jest.fn().mockResolvedValue({ ...user, id: "id" }),
        } as unknown as Partial<Model<IUser>>;

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        await TestServe.create(user);

        expect(model.create).toHaveBeenCalled();
      });
    });
  });
});
