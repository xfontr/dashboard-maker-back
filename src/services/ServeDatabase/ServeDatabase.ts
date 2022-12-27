import { NextFunction } from "express";
import { Model } from "mongoose";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";

export default <T>(model: Model<T>) =>
  (next: NextFunction) => {
    const tryThis = catchCodedError(next);

    const GetAll = () => ({
      getAll: async (query: object = {}) => {
        const response = await tryThis<T>(model.find.bind(model), query);
        return response;
      },
    });

    return { ...GetAll() };
  };
