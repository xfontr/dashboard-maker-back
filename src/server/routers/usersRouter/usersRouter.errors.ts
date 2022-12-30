import { userMainIdentifier } from "../../../config/database";
import CodedError from "../../../utils/CodedError/CodedError";

export const notFoundToken = CodedError(
  "notFound",
  "The registration data provided is not valid. If the error persists, please contact the administrator"
)(Error("The token doesn't exist"));

export const invalidSignUp = CodedError(
  "conflict",
  "Invalid sign up data"
)(Error("There's a user using the same email"));

export const logInUserDoesNotExist = CodedError(
  "notFound",
  `Invalid ${userMainIdentifier} or password`
)(Error("User doesn't exist"));

export const invalidPassword = CodedError(
  "badRequest",
  `Invalid ${userMainIdentifier} or password`
)(Error("Invalid password"));
