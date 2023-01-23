import { NextFunction } from "express";
import { Model } from "mongoose";
import ERROR_CODES from "../../../config/errorCodes";
import catchCodedError from "../../utils/catchCodedError";
import { ICustomError } from "../../utils/CustomError";
import MethodOptions from "./ServeDatabase.types";

const {
  error: { conflict, notFound },
} = ERROR_CODES;

export default <T>(model: Model<T>) =>
  (next: NextFunction) => {
    const tryThis = catchCodedError(next);

    const Get = () => ({
      /**
       * If error, throws a internal server error
       *
       * @example
       *   await Service.getAll({ email: "email@email.com" });
       *
       * @param query
       */
      getAll: async (query: object = {}) => {
        const response = await tryThis<T, T[]>(model.find.bind(model), [query]);
        return response;
      },

      /**
       * If error, throws a not found error
       *
       * @example
       *   await Service.getById("1513582713");
       *
       * @param id
       */
      getById: async (id: string) => {
        const response = await tryThis<string, T>(
          model.findById.bind(model),
          [id],
          "notFound"
        );
        return response;
      },

      /**
       * @example
       *   Service.getByAttribute(
       *     "email",
       *     "email@email.com",
       *     CodedError("conflict")(Error())
       *   );
       *
       * @param attribute The key that will be used to find the specific
       *   attribute, such as "email"
       * @param value The value associated to the key, such as "email@email.com"
       * @param error If it's a 404 / 409 error, it will throw error only if it
       *   doesn't find the item / only if it finds it. For any other error, it
       *   will do nothing
       */
      getByAttribute: async (
        attribute: keyof T,
        value: string | number,
        error?: ICustomError
      ) => {
        const response = await tryThis<T, T[]>(model.find.bind(model), [
          {
            [attribute]: value,
          },
        ]);

        if (
          error &&
          ((error.code === conflict && response && response.length) ||
            (error.code === notFound && response && !response.length))
        ) {
          next(error);
          return true;
        }

        return response;
      },
    });

    const Create = () => ({
      /**
       * @example
       *   Service.create(
       *     { id: 1, name: "John" },
       *     {
       *       replace: true,
       *       mainIdentifier: "id",
       *     }
       *   );
       *
       * @param newItem The item to be created
       * @param options Object with options such as "replace". Relevant: if
       *   using the replace option, it will require to set also a
       *   mainIdentifier attribute, by which the object to be replaced will be
       *   found
       */
      create: async (newItem: T, options: MethodOptions<T> = {}) => {
        let item;

        if (options.replace && options.mainIdentifier) {
          item = await tryThis<T, T>(model.find.bind(model), [
            { [options.mainIdentifier]: newItem[options.mainIdentifier] },
          ]);
        }

        if (item) {
          await tryThis<T, T>(model.deleteOne.bind(model), [
            { [options.mainIdentifier]: newItem[options.mainIdentifier] },
          ]);
        }

        const response = await tryThis<T, T>(
          model.create.bind(model),
          [newItem],
          "badRequest"
        );

        return response;
      },
    });

    const Delete = () => ({
      /**
       * If error, will throw a not found by default
       *
       * @example
       *   Service.getByAttribute(
       *     "email",
       *     "email@email.com",
       *     CodedError("conflict")(Error())
       *   );
       *
       * @param attribute The key that will be used to find the specific
       *   attribute, such as "email"
       * @param value The value associated to the key, such as "email@email.com"
       */
      deleteByAttribute: async (attribute: keyof T, value: string | number) => {
        const response = await tryThis<T, T>(
          model.deleteMany.bind(model),
          [{ [attribute]: value }],
          "notFound"
        );

        return response;
      },
    });

    // TODO: Test new update method

    const Update = () => ({
      updateById: async (itemId: string, updates: Partial<T>) => {
        const response = await tryThis<T, T>(
          model.findByIdAndUpdate.bind(model),
          [itemId, updates]
        );

        return response;
      },
    });

    return { ...Get(), ...Create(), ...Delete(), ...Update() };
  };
