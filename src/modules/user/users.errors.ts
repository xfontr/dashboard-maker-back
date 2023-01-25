import CodedError from "../../common/utils/CodedError";
import { MAIN_IDENTIFIER } from "../../config/database";

const AuthTokens = () => ({
  invalidAuthToken: CodedError(
    "badRequest",
    "Invalid request, could not create token"
  ),

  noToken: CodedError(
    "unauthorized",
    "Unauthorized request"
  )(Error("There is no token or the token provided is not valid")),

  forbiddenToken: CodedError(
    "forbidden",
    "The requested action is forbidden"
  )(Error("The token provided does not match with the user token")),

  noLinkedToken: CodedError(
    "notFound",
    "Unauthorized request"
  )(Error("Could not find a user with the requested token")),
});

const Register = () => ({
  notFoundToken: CodedError(
    "notFound",
    "The registration data provided is not valid. If the error persists, please contact the administrator"
  )(Error("The token doesn't exist")),

  invalidToken: CodedError(
    "unauthorized",
    "The registration data provided is not valid. If the error persists, please contact the administrator"
  )(Error("Invalid registration token")),

  invalidSignUp: CodedError(
    "conflict",
    "Invalid sign up data"
  )(Error("There's a user using the same email")),

  invalidRole: CodedError(
    "unauthorized",
    "Invalid sign up data. If the error persists, please contact the administrator"
  )(Error("The role requested is not allowed by the token")),
});

const LogIn = () => ({
  logInUserDoesNotExist: CodedError(
    "notFound",
    `Invalid ${MAIN_IDENTIFIER} or password`
  )(Error("User doesn't exist")),

  invalidPassword: CodedError(
    "badRequest",
    `Invalid ${MAIN_IDENTIFIER} or password`
  )(Error("Invalid password")),
});

const userErrors = {
  ...AuthTokens(),
  ...Register(),
  ...LogIn(),
};

export default userErrors;
