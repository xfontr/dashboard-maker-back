import codes from "../../config/codes";
import camelToRegular from "../camelToRegular/camelToRegular";

export interface ICustomError extends Error {
  code: number;
  privateMessage: string;
}

export default (
  (availableCodes: typeof codes.error) =>
  (
    { message }: Error,
    code?: number,
    privateMessage?: string
  ): ICustomError => ({
    name: code
      ? `Error ${code}`
      : `Error ${availableCodes.internalServerError}`,
    code: code || availableCodes.internalServerError,
    message: message || camelToRegular("internalServerError"),
    privateMessage: privateMessage || "Unknown error",
  })
)(codes.error);
