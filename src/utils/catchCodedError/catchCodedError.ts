import { NextFunction } from "express";
import CodedError, { Codes } from "../CodedError/CodedError";

export default (next: NextFunction) =>
  async <T>(
    callback: Function,
    argument: object,
    errorType: Codes = "internalServerError"
  ): Promise<T | void> => {
    try {
      const response = await callback(argument);
      return response;
    } catch (error) {
      const newError = CodedError(errorType, error);
      next(newError);
      return undefined;
    }
  };
