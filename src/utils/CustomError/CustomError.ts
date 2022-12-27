import codes from "../../config/codes";
import camelToRegular from "../camelToRegular/camelToRegular";

export interface ICustomError extends Error {
  privateMessage: string;
}

export default (
  (availableCodes: typeof codes.error) =>
  ({ name, message }: Error, privateMessage?: string): ICustomError => ({
    name:
      name === "Error" || !name
        ? `Error ${availableCodes.internalServerError}`
        : name,
    message: message || camelToRegular("internalServerError"),
    privateMessage: privateMessage ?? "Unknown error",
  })
)(codes.error);
