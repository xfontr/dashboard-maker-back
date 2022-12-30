import CodedError from "../../../utils/CodedError/CodedError";

const emailAlreadyRegistered = CodedError(
  "conflict",
  "The requested token can't be authorized"
)(Error("The token's email is already registered"));

export default emailAlreadyRegistered;
