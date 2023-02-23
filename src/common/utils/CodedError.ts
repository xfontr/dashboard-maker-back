import HTTP_CODES from "../../config/errorCodes";
import camelToRegular from "./camelToRegular";
import CustomError, { ICustomError } from "./CustomError";

export type Codes = keyof typeof HTTP_CODES.error;

export default (
  (availableCodes: typeof HTTP_CODES.error) =>
  (code: Codes, publicMessage?: string) =>
  (error: Error): ICustomError => {
    const newError = error;

    newError.message = error.message || camelToRegular(code);

    return CustomError(
      newError,
      availableCodes[code],
      publicMessage ||
        "Something went wrong. Please contact the administrator to address the issue"
    );
  }
)(HTTP_CODES.error);
