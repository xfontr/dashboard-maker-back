import codes from "../../config/codes";
import camelToRegular from "./camelToRegular";

export interface ICustomError extends Error {
  code: number;
  publicMessage: string;
}

export default (
  (availableCodes: typeof codes.error) =>
  ({ message }: Error, code?: number, publicMessage?: string): ICustomError =>
    Object.setPrototypeOf(
      {
        name: code
          ? `Error ${code}`
          : `Error ${availableCodes.internalServerError}`,
        code: code || availableCodes.internalServerError,
        message: message || "Unknown error",
        publicMessage: publicMessage || camelToRegular("internalServerError"),
      },
      Error()
    )
)(codes.error);
