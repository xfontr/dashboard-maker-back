import { NextFunction } from "express";
import { MAIN_IDENTIFIER } from "../../config/database";
import { compareHash } from "../services/authentication";
import catchCodedError from "./catchCodedError";
import getBearerToken from "./getBearerToken";
import userErrors from "../../modules/user/users.errors";
import CustomRequest from "../types/CustomRequest";

const isSignTokenValid = async (
  req: CustomRequest,
  next: NextFunction,
  skip: boolean = false
): Promise<boolean> => {
  if (skip || !req.token.isCodeRequired) return true;

  const tryThis = catchCodedError(next);
  const code = getBearerToken(req.headers?.authorization);

  if (
    !code ||
    req.token[MAIN_IDENTIFIER] !== req.body[MAIN_IDENTIFIER] ||
    !(await tryThis(compareHash, [code, req.token.code]))
  ) {
    next(userErrors.invalidToken);
    return false;
  }

  return true;
};

export default isSignTokenValid;
