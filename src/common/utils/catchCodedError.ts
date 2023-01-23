import { NextFunction } from "express";
import camelToRegular from "./camelToRegular";
import CodedError, { Codes } from "./CodedError";

export default (next: NextFunction) =>
  async <T, R>(
    callback: Function,
    args: (object | object[] | T | T[] | string)[],
    errorType: Codes = "internalServerError"
  ): Promise<R | void> => {
    try {
      const response = await callback(...args);

      return response;
    } catch (error) {
      const newError = CodedError(errorType, camelToRegular(errorType))(error);
      next(newError);
      return undefined;
    }
  };
