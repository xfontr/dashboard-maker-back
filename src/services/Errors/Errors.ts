import { userMainIdentifier } from "../../config/database";
import CodedError from "../../utils/CodedError/CodedError";

const RegistrationTokens = () => ({
  emailAlreadyRegistered: CodedError(
    "conflict",
    "The requested token can't be authorized"
  )(Error("The token's email is already registered")),
});

const AuthTokens = () => ({
  invalidAuthToken: CodedError("badRequest", "Authentication error"),
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
    `Invalid ${userMainIdentifier} or password`
  )(Error("User doesn't exist")),

  invalidPassword: CodedError(
    "badRequest",
    `Invalid ${userMainIdentifier} or password`
  )(Error("Invalid password")),
});

const Errors = (() => ({
  tokens: {
    ...RegistrationTokens(),
  },

  users: {
    ...AuthTokens(),
    ...Register(),
    ...LogIn(),
  },
}))();

export default Errors;
