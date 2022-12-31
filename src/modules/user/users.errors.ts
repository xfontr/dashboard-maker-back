import CodedError from "../../common/utils/CodedError";
import { USER_MAIN_IDENTIFIER } from "../../config/database";

const AuthTokens = () => ({
  invalidAuthToken: CodedError(
    "badRequest",
    "Invalid request, could not create token"
  ),
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
    `Invalid ${USER_MAIN_IDENTIFIER} or password`
  )(Error("User doesn't exist")),

  invalidPassword: CodedError(
    "badRequest",
    `Invalid ${USER_MAIN_IDENTIFIER} or password`
  )(Error("Invalid password")),
});

const userErrors = {
  ...AuthTokens(),
  ...Register(),
  ...LogIn(),
};

export default userErrors;
