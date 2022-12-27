import codes from "../../config/codes";
import camelToRegular from "../camelToRegular/camelToRegular";
import CustomError, { ICustomError } from "../CustomError/CustomError";

type Codes = keyof typeof codes.error;

export default (
  (availableCodes: typeof codes.error) =>
  (code: Codes, error: Error, privateMessage?: string): ICustomError => {
    const newError = error;
    newError.name = `Error ${availableCodes[code]}`;
    newError.message = error.message || camelToRegular(code);

    return CustomError(newError, privateMessage ?? newError.message);
  }
)(codes.error);
