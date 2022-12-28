import codes from "../../config/codes";
import camelToRegular from "../camelToRegular/camelToRegular";
import CustomError, { ICustomError } from "../CustomError/CustomError";

export type Codes = keyof typeof codes.error;

export default (
  (availableCodes: typeof codes.error) =>
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
)(codes.error);
