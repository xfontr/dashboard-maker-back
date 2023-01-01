import { NextFunction } from "express";
import { Model } from "mongoose";
import IUser from "../../../modules/user/users.types";
import camelToRegular from "../../utils/camelToRegular";
import CodedError from "../../utils/CodedError";
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

    describe("Then it should return a getById method that should", () => {
      test("call the findById method and return its response", async () => {
        const id = "id";
        const response = "Test";
        const model = {
          findById: jest.fn().mockResolvedValue(response),
        } as unknown as Partial<Model<IUser>>;

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        const result = await TestServe.getById(id);

        expect(result).toBe(response);
        expect(model.findById).toHaveBeenCalled();
      });

      test("Then it should call next with an error if the method throws an error", async () => {
        const id = "id";
        const error = new Error();
        const response = Promise.reject(error);
        const errorType = "badRequest";

        const model = {
          findById: () => response,
        } as unknown as Partial<Model<IUser>>;

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        await TestServe.getById(id);

        expect(next).toHaveBeenCalledWith(
          CodedError(errorType, camelToRegular(errorType))(error)
        );
      });
    });

    describe("Then it should return a getByAttribute method that should", () => {
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
      test("call the method to create a document and return it", async () => {
        const user = { name: "Test" } as IUser;
        const model = {
          find: jest.fn().mockResolvedValue({ ...user, id: "id" }),
          deleteOne: jest.fn(),
          create: jest.fn().mockResolvedValue({ ...user, id: "id" }),
        } as unknown as Partial<Model<IUser>>;

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        const response = await TestServe.create(user);

        expect(model.create).toHaveBeenCalled();
        expect(response).toStrictEqual({ ...user, id: "id" });

        expect(model.deleteOne).not.toHaveBeenCalled();
        expect(model.find).not.toHaveBeenCalled();
      });

      test("call the method to create a document and replace the existent document if requested", async () => {
        const user = { name: "Test" } as IUser;
        const model = {
          find: jest.fn().mockResolvedValue({ ...user, id: "id" }),
          deleteOne: jest.fn(),
          create: jest.fn().mockResolvedValue({ ...user, id: "id" }),
        } as unknown as Partial<Model<IUser>>;

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        await TestServe.create(user, { replace: true, mainIdentifier: "id" });

        expect(model.find).toHaveBeenCalled();
        expect(model.deleteOne).toHaveBeenCalled();
        expect(model.create).toHaveBeenCalled();
      });
    });

    describe("Then it should return a deleteByAttribute method that should", () => {
      test("call the delete method with specific parameters and return its response", async () => {
        const model = {
          deleteMany: jest.fn().mockResolvedValue("response"),
        } as unknown as Partial<Model<IUser>>;

        const attribute = "email";
        const value = "test@test.com";

        const TestServe = ServeDatabase(model as Model<IUser>)(next);

        const response = await TestServe.deleteByAttribute(attribute, value);

        expect(model.deleteMany).toHaveBeenCalledWith({
          [attribute]: value,
        });
        expect(response).toBe("response");
      });
    });
  });
});
