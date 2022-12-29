import { NextFunction } from "express";
import { Model } from "mongoose";
import codes from "../../config/codes";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import { ICustomError } from "../../utils/CustomError/CustomError";

const {
  error: { conflict, notFound },
} = codes;

export default <T>(model: Model<T>) =>
  (next: NextFunction) => {
    const tryThis = catchCodedError(next);

    const Get = () => ({
      getAll: async (query: object = {}) => {
        const response = await tryThis<T, T[]>(model.find.bind(model), [query]);
        return response;
      },

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
      create: async (newItem: T) => {
        const response = await tryThis<T, T>(
          model.create.bind(model),
          [newItem],
          "badRequest"
        );
        return response;
      },
    });

    const Delete = () => ({
      deleteByAttribute: async (attribute: keyof T, value: string | number) => {
        const response = await tryThis<T, T>(
          model.deleteMany.bind(model),
          [{ [attribute]: value }],
          "notFound"
        );
        return response;
      },
    });

    return { ...Get(), ...Create(), ...Delete() };
  };
