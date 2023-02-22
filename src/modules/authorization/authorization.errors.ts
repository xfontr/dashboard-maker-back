import CodedError from "../../common/utils/CodedError";

const authorizationErrors = {
  invalidRole: CodedError(
    "unauthorized",
    "It was not possible to complete the action requested. If you believe this was a mistake, please contact the administrator"
  )(Error("The user is not authorized to perform this action")),
};

export default authorizationErrors;
