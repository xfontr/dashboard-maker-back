import { NextFunction } from "express";
import { Model } from "mongoose";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import { ICustomError } from "../../utils/CustomError/CustomError";

export default <T>(model: Model<T>) =>
  (next: NextFunction) => {
    const tryThis = catchCodedError(next);

    const Get = () => ({
      getAll: async (query: object = {}) => {
        const response = await tryThis<T, T[]>(model.find.bind(model), query);
        return response;
      },
      getByAttribute: async (
        attribute: keyof T,
        value: string | number,
        errorIfExists?: ICustomError
      ) => {
        const response = await tryThis<T, T[]>(model.find.bind(model), {
          [attribute]: value,
        });

        if (errorIfExists && response && response.length) {
          next(errorIfExists);
          return true;
        }

        return response;
      },
    });

    const Create = () => ({
      create: async (newItem: T) => {
        await tryThis<T, T>(model.create.bind(model), newItem, "badRequest");
      },
    });

    return { ...Get(), ...Create() };
  };
