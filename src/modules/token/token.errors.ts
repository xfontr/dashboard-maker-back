import CodedError from "../../common/utils/CodedError";

const RegistrationTokens = () => ({
  emailAlreadyRegistered: CodedError(
    "conflict",
    "The requested token can't be authorized"
  )(Error("The token's email is already registered")),

  unauthorizedToCreate: CodedError(
    "unauthorized",
    "The requested token can't be authorized"
  )(Error("The person requesting the token is not allowed to")),
});

const VerifyToken = () => ({
  tokenNotFound: CodedError(
    "notFound",
    "The token provided seems invalid. Please, contact administration if the error persists"
  )(Error("The token doesn't exist")),
});

const tokenErrors = {
  ...RegistrationTokens(),
  ...VerifyToken(),
};

export default tokenErrors;
