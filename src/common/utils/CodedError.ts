import ERROR_CODES from "../../config/errorCodes";
import camelToRegular from "./camelToRegular";
import CustomError, { ICustomError } from "./CustomError";

export type Codes = keyof typeof ERROR_CODES.error;

export default (
  (availableCodes: typeof ERROR_CODES.error) =>
  (code: Codes, publicMessage?: string) =>
  (error: Error): ICustomError => {
    const newError = error;

    newError.name = `Error ${availableCodes[code]}`;
    newError.message = error.message || camelToRegular(code);

    return CustomError(
      newError,
      availableCodes[code],
      publicMessage ||
        "Something went wrong. Please contact the administrator to address the issue"
    );
  }
)(ERROR_CODES.error);
